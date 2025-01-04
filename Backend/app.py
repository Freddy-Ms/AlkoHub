# w app.py
from flask_cors import CORS
from flask import Flask, request, jsonify, session
from models import db, Alkohol, Uzytkownik, Historia, Osiagniecie, Ulubione

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
    message, status_code = Uzytkownik.register(data)
    return jsonify(message), status_code

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Uzytkownik.login(data['nazwa'], data['haslo'])
    if user:
        return jsonify({'message': 'Zalogowano pomyślnie!', 'user_id': user.id}), 200
    return jsonify({"message": "Nieprawidłowe dane logowania."}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Wylogowanie zakończone sukcesem!"})

@app.route('/getProducts', methods=['GET'])
def get_products():
    categories = request.args.get('categories')
    produkty = Alkohol.get_products(categories)
    return jsonify(produkty)

@app.route('/historia/<int:uzytkownik_id>', methods=['GET'])
def get_user_history(uzytkownik_id):
    result = Uzytkownik.get_user_history(uzytkownik_id)
    if result is None:
        return jsonify({'message': 'Brak historii dla tego użytkownika.'}), 404
    return jsonify({'historia': result}), 200

@app.route('/osiagniecia', methods=['GET'])
def get_osiagniecia():
    try:
        osiagniecia_list = Osiagniecie.get_all_osiagniecia()
        return jsonify(osiagniecia_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ulubione/<int:uzytkownik_id>', methods=['GET'])
def get_ulubione_alkohole(uzytkownik_id):
    try:
        uzytkownik = Uzytkownik.query.get(uzytkownik_id)
        if not uzytkownik:
            return jsonify({"error": "Użytkownik nie istnieje"}), 404

        categories = request.args.get('categories')
        ulubione_alkohole = Alkohol.get_favorite_drinks(uzytkownik_id, categories)
        return jsonify(ulubione_alkohole)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
