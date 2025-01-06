# w app.py
from flask_cors import CORS
from flask import Flask, request, jsonify, session
from Models import db, Alkohol, Uzytkownik, Historia, Osiagniecie, Ulubione, RodzajAlkoholu
from datetime import datetime

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
        return jsonify({'message': 'Zalogowano pomyślnie!', 'user_id': user.id, 'user_ranga': user.ranga_rel.nazwa}), 200
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
    
@app.route('/getUserInfo/<int:uzytkownik_id>', methods=['GET'])
def get_user_info(uzytkownik_id):
    try:
        user_info = Uzytkownik.get_user_info(uzytkownik_id)
        if not user_info:
            return jsonify({"message": "Użytkownik nie znaleziony."}), 404
        return jsonify({"user_info": user_info}), 200
    except Exception as e:
        return jsonify({"message": f"Błąd: {str(e)}"}), 500


@app.route('/getCompletedAchievements/<int:uzytkownik_id>', methods=['GET'])
def get_completed_achievements(uzytkownik_id):
    try:
        completed_achievements = Uzytkownik.get_completed_achievements(uzytkownik_id)
        return jsonify({"completed_achievements": completed_achievements}), 200
    except Exception as e:
        return jsonify({"message": f"Błąd: {str(e)}"}), 500
    

@app.route('/historia/24h/<int:uzytkownik_id>', methods=['GET'])
def get_user_history_24h(uzytkownik_id):
    result = Uzytkownik.get_user_history_24h(uzytkownik_id)
    return jsonify(result)

@app.route('/delete_fromn_history/<int:user_id>/<int:alkohol_id>', methods=['DELETE'])
def delete_history_entry(user_id, alkohol_id):
    data = request.args.get('data')  # Pobranie daty z parametrów zapytania
    response, status_code = Uzytkownik.delete_history_entry(user_id, alkohol_id, data)
    return jsonify(response), status_code

@app.route('/add_to_history/<int:user_id>/<int:alkohol_id>', methods=['POST'])
def add_to_history(user_id, alkohol_id):
    data = request.json
    ilosc_wypitego_ml = data['ilosc_wypitego_ml']
    response, status_code = Uzytkownik.add_to_history(user_id, alkohol_id, ilosc_wypitego_ml)
    return jsonify(response), status_code

@app.route('/favourite_add/<int:user_id>/<int:alkohol_id>', methods=['POST'])
def favourite_add(user_id, alkohol_id):
    # Dodaj alkohol do ulubionych
    response, status_code = Ulubione.add_favorite(user_id, alkohol_id)
    return jsonify(response), status_code


@app.route('/favourite_delete/<int:user_id>/<int:alkohol_id>', methods=['POST'])
def favourite_delete(user_id, alkohol_id):
    # Usuń alkohol z ulubionych
    response, status_code = Ulubione.delete_favorite(user_id, alkohol_id)
    return jsonify(response), status_code

@app.route('/get_product_details/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    result, status = Alkohol.get_product_details_with_reviews(product_id)
    return jsonify(result), status

@app.route('/alcohol_types', methods=['GET'])
def get_alcohol_types():
    try:
        names = RodzajAlkoholu.get_all_names()
        return jsonify(names), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/is_favorite/<int:uzytkownik_id>/<int:alkohol_id>', methods=['GET'])
def is_favorite(uzytkownik_id, alkohol_id):
    try:
        result = Ulubione.is_favorite(uzytkownik_id, alkohol_id)
        return jsonify({"is_favorite": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/update_user_info/<int:user_id>', methods=['PUT'])
def update_user_info(user_id):
    data = request.get_json()
    response, status_code = Uzytkownik.update_user_info(user_id, data)
    return jsonify(response), status_code

if __name__ == "__main__":
    app.run(debug=True)
