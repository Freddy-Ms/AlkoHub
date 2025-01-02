from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'super_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Macielixx123@localhost/alkohub'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

class Uzytkownik(db.Model):
    __tablename__ = 'uzytkownicy'
    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(15), nullable=False, unique=True)
    mail = db.Column(db.String(50), nullable=False, unique=True)
    haslo = db.Column(db.String(255), nullable=False)
    waga = db.Column(db.Float, nullable=True)
    wiek = db.Column(db.Integer, nullable=True)
    plec = db.Column(db.Boolean, nullable=True)
    ranga = db.Column(db.Integer, default=1)  # Domyślna wartość 1


@app.route('/check_connection', methods=['GET'])
def check_connection():
    try:
        # Próbujemy wykonać zapytanie do bazy
        result = db.session.execute('SELECT 1')
        return jsonify({"message": "Połączenie z bazą danych jest aktywne!"}), 200
    except Exception as e:
        return jsonify({"message": f"Błąd połączenia z bazą danych: {str(e)}"}), 500
    
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
    print(data['plec'])
    print(plec)
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

if __name__ == '__main__':
    app.run(debug=True)