from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Alkohol, RodzajAlkoholu, Uzytkownik, Historia, Osiagniecie, Ulubione

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Macielixx123@localhost/alkohub'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 

CORS(app)
db.init_app(app)



    
@app.route('/')
def homepage():
    return jsonify({"message": "Witamy na stronie głównej!"})

@app.route('/register', methods=['POST'])
def register():
    data = request.json

    # Sprawdzanie, czy użytkownik o danym mailu lub nazwie już istnieje
    existing_user_by_nazwa = Uzytkownik.query.filter_by(nazwa=data['nazwa']).first()
    existing_user_by_mail = Uzytkownik.query.filter_by(mail=data['mail']).first()
    
    if existing_user_by_nazwa:
        return jsonify({"message": "Błąd rejestracji: Użytkownik z tą nazwą już istnieje."}), 400
    
    if existing_user_by_mail:
        return jsonify({"message": "Błąd rejestracji: Użytkownik z tym emailem już istnieje."}), 400

    hashed_password = generate_password_hash(data['haslo'], method='pbkdf2:sha256')
    plec = True if int(data['plec']) == 0 else False
    new_user = Uzytkownik(
        nazwa=data['nazwa'],
        mail=data['mail'],
        haslo=hashed_password,
        waga=data['waga'],
        wiek=data['wiek'],
        plec=plec
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Rejestracja zakończona sukcesem!"})
    except Exception as e:
        # Zwrócenie bardziej szczegółowego komunikatu o błędzie
        return jsonify({"message": f"Błąd podczas rejestracji: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = None
    
    if '@' in data['nazwa']:  # Jeżeli użytkownik podał maila
        user = Uzytkownik.query.filter_by(mail=data['nazwa']).first()
    else:  # Jeżeli podał nazwę
        user = Uzytkownik.query.filter_by(nazwa=data['nazwa']).first()
    
    if user and check_password_hash(user.haslo, data['haslo']):
        session['user_id'] = user.id
        return jsonify({'message': 'Zalogowano pomyślnie!', 'user_id': user.id}), 200
    return jsonify({"message": "Nieprawidłowe dane logowania."}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Wylogowanie zakończone sukcesem!"})

@app.route('/getProducts', methods=['GET'])
def get_products():
    categories = request.args.get('categories')  # Pobranie parametrów 'categories' z URL
    if categories:
        categories_list = categories.split(',')  # Rozdzielamy kategorie po przecinku
        # Filtrujemy produkty na podstawie wybranych kategorii
        produkty = Alkohol.query.join(RodzajAlkoholu).filter(RodzajAlkoholu.nazwa.in_(categories_list)).all()
    else:
        produkty = Alkohol.query.all()  # Jeśli brak filtrów, pobieramy wszystkie produkty

    # Przygotowujemy odpowiedź
    result = [{"nazwa_alkoholu": a.nazwa_alkoholu, "zawartosc_procentowa": a.zawartosc_procentowa, "image_url": a.image_url} for a in produkty]
    
    return jsonify(result)


@app.route('/historia/<int:uzytkownik_id>', methods=['GET'])
def get_user_history(uzytkownik_id):
    try:
        historia = Historia.query.filter_by(id_uzytkownika = uzytkownik_id).all()
        if not historia:
            return jsonify({'message': 'Brak historii dla tego użytkownika.'}), 404

        result = []
        for record in historia:
            result.append({
                'nazwa_alkoholu': record.alkohol.nazwa_alkoholu,  # Pobieranie nazwy alkoholu
                'data': record.data.strftime('%Y-%m-%d %H:%M:%S'),
                'ilosc_wypitego_ml': record.ilosc_wypitego_ml,
                'image_url': record.alkohol.image_url
            })

        return jsonify({'historia': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/osiagniecia', methods=['GET'])
def get_osiagniecia():
    try:
        # Pobieramy wszystkie osiągnięcia
        osiagniecia = Osiagniecie.query.all()
        
        osiagniecia_list = []
        for osiagniecie in osiagniecia:
            osiagniecia_list.append({
                'id_osiagniecia': osiagniecie.id_osiagniecia,
                'rodzaj_alkoholu': osiagniecie.rodzaj_alkoholu,
                'nazwa_osiagniecia': osiagniecie.nazwa_osiagniecia,
                'opis_osiagniecia': osiagniecie.opis_osiagniecia,
                'ilosc_wymagana_ml': osiagniecie.ilosc_wymagana_ml
            })
        
        return jsonify(osiagniecia_list)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/ulubione/<int:uzytkownik_id>', methods=['GET'])
def get_ulubione_alkohole(uzytkownik_id):
    try:
        # Pobranie użytkownika
        uzytkownik = Uzytkownik.query.get(uzytkownik_id)
        if not uzytkownik:
            return jsonify({"error": "Użytkownik nie istnieje"}), 404
        
        # Pobranie ulubionych alkoholi użytkownika
        ulubione = db.session.query(Alkohol).join(Ulubione).filter(Ulubione.id_uzytkownika == uzytkownik_id).all()
        
        # Sprawdzenie, czy użytkownik ma ulubione alkohole
        if not ulubione:
            return jsonify({"message": "Brak ulubionych alkoholi dla tego użytkownika"}), 404
        
        # Przygotowanie danych do zwrócenia
        ulubione_alkohole = [
            {
                'id': alkohol.id,
                'nazwa_alkoholu': alkohol.nazwa_alkoholu,
                'opis_alkoholu': alkohol.opis_alkoholu,
                'zawartosc_procentowa': alkohol.zawartosc_procentowa,
                'rok_produkcji': alkohol.rok_produkcji,
                "image_url": alkohol.image_url
            }
            for alkohol in ulubione
        ]
        
        return jsonify(ulubione_alkohole)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)