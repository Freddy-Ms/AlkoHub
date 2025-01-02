from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Alkohol, RodzajAlkoholu, Uzytkownik

app = Flask(__name__)
app.secret_key = 'super_secret_key'
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)