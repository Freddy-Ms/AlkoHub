from . import db
from sqlalchemy import CheckConstraint
from datetime import datetime
class Opinia(db.Model):
    __tablename__ = 'opinie'

    id_alkoholu = db.Column(db.Integer, db.ForeignKey('alkohole.id'), primary_key=True)
    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownicy.id'), primary_key=True)
    znacznik_czasu = db.Column(db.DateTime, nullable=False)
    ocena = db.Column(db.Integer, nullable=True)
    recenzja = db.Column(db.Text, nullable=True)

    __table_args__ = (
        db.UniqueConstraint('id_uzytkownika', 'id_alkoholu', name='unique_user_alcohol'),
        CheckConstraint('ocena >= 1 AND ocena <= 5', name='check_ocena_range'),
    )

    alkohol = db.relationship('Alkohol', backref='opinie')
    uzytkownik = db.relationship('Uzytkownik', backref='opinie')

    @staticmethod
    def add_opinion(data):
        try:
            # Sprawdzenie wymaganych pól
            if not all(key in data for key in ['produkt_id', 'user_id', 'ocena', 'recenzja']):
                return {"message": "Brak wymaganych danych."}, 400

            # Walidacja zakresu oceny
            if not (1 <= data['ocena'] <= 5):
                return {"message": "Ocena musi być w zakresie od 1 do 5."}, 400
            
            existing_opinion = Opinia.query.filter_by(
            id_alkoholu=data['produkt_id'],
            id_uzytkownika=data['user_id']
            ).first()

            if existing_opinion:
                return jsonify({"message": "Już wystawiłeś opinię o tym produkcie."}), 409
            
            # Utworzenie nowej opinii
            nowa_opinia = Opinia(
                id_alkoholu=data['produkt_id'],
                id_uzytkownika=data['user_id'],
                znacznik_czasu=datetime.utcnow(),
                ocena=data['ocena'],
                recenzja=data['recenzja']
            )

            db.session.add(nowa_opinia)
            db.session.commit()
            return {"message": "Opinia została dodana pomyślnie.", "success": True}, 201

        except db.IntegrityError:
            db.session.rollback()
            return {"message": "Opinia dla tego produktu już istnieje."}, 409

        except Exception as e:
            db.session.rollback()
            return {"message": f"Błąd podczas dodawania opinii: {str(e)}"}, 500
        
    @staticmethod
    def check_user_opinion(user_id, alkohol_id):
        try:
            # Sprawdzenie, czy opinia istnieje w bazie danych
            opinia = db.session.query(Opinia).filter_by(id_uzytkownika=user_id, id_alkoholu=alkohol_id).first()

            if opinia:
                # Jeśli opinia istnieje, zwróć ją
                return {
                    'exists': True,
                    'ocena': opinia.ocena,
                    'recenzja': opinia.recenzja
                }
            else:
                # Jeśli opinia nie istnieje
                return {'exists': False}

        except Exception as e:
            # Obsługuje błędy i zwraca komunikat o błędzie
            return {"message": f"Błąd serwera: {str(e)}"}
        
    @staticmethod
    def update_opinion(user_id, alkohol_id, ocena, recenzja):
        try:
            # Szukamy opinii w bazie danych
            opinia = db.session.query(Opinia).filter_by(id_uzytkownika=user_id, id_alkoholu=alkohol_id).first()

            if opinia:
                # Zaktualizowanie opinii
                opinia.ocena = ocena
                opinia.recenzja = recenzja
                db.session.commit()

                return {'message': 'Opinia została zaktualizowana pomyślnie'}
            else:
                return {'message': 'Opinia nie została znaleziona'}, 404

        except Exception as e:
            return {"message": f"Błąd serwera: {str(e)}"}, 500