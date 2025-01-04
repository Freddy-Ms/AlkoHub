from .Historia import Historia
from .UkonczoneOsiagniecie import UkonczoneOsiagniecie
from .RangaUzytkownika import RangaUzytkownika
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta


#True (1) -> Mężczyzna
#False (0) -> Kobieta


class Uzytkownik(db.Model):
    __tablename__ = 'uzytkownicy'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(15), nullable=False, unique=True)
    mail = db.Column(db.String(50), nullable=False, unique=True)
    haslo = db.Column(db.String(255), nullable=False)
    waga = db.Column(db.Float, nullable=True)
    wiek = db.Column(db.Integer, nullable=True)
    plec = db.Column(db.Boolean, nullable=True)
    ranga = db.Column(db.Integer, db.ForeignKey('rangi_uzytkownika.id'), default=1)

    ranga_rel = db.relationship('RangaUzytkownika', backref='uzytkownicy')
    ukonczone_osiagniecia_rel = db.relationship('UkonczoneOsiagniecie', back_populates='uzytkownik')

    @staticmethod
    def login(nazwa, haslo):
        user = None
        if '@' in nazwa:
            user = Uzytkownik.query.filter_by(mail=nazwa).first()
        else:
            user = Uzytkownik.query.filter_by(nazwa=nazwa).first()
        
        if user and check_password_hash(user.haslo, haslo):
            return user
        return None

    @staticmethod
    def register(data):
        try:
            existing_user_by_nazwa = Uzytkownik.query.filter_by(nazwa=data['nazwa']).first()
            existing_user_by_mail = Uzytkownik.query.filter_by(mail=data['mail']).first()
            
            if existing_user_by_nazwa:
                return {"message": "Błąd rejestracji: Użytkownik z tą nazwą już istnieje."}, 400
            
            if existing_user_by_mail:
                return {"message": "Błąd rejestracji: Użytkownik z tym emailem już istnieje."}, 400

            hashed_password = generate_password_hash(data['haslo'], method='pbkdf2:sha256')
            plec = True if int(data['plec']) == 1 else False
            new_user = Uzytkownik(
                nazwa=data['nazwa'],
                mail=data['mail'],
                haslo=hashed_password,
                waga=data['waga'],
                wiek=data['wiek'],
                plec=plec
            )
            db.session.add(new_user)
            db.session.commit()
            return {"message": "Rejestracja zakończona sukcesem!"}, 201
        except Exception as e:
            return {"message": f"Błąd podczas rejestracji: {str(e)}"}, 500

    @staticmethod
    def get_user_history(uzytkownik_id):
        try:
            historia = Historia.query.filter_by(id_uzytkownika=uzytkownik_id).all()

            result = []
            for record in historia:
                result.append({
                    'nazwa_alkoholu': record.alkohol.nazwa_alkoholu,
                    'data': record.data.strftime('%Y-%m-%d %H:%M:%S'),
                    'ilosc_wypitego_ml': record.ilosc_wypitego_ml,
                    'image_url': record.alkohol.image_url
                })
            return result
        except Exception as e:
            return str(e)
        
    @staticmethod
    def get_user_info(uzytkownik_id):
        """Metoda zwracająca dane użytkownika w formie słownika"""
        user = Uzytkownik.query.get(uzytkownik_id)
        if user:
            return {
                "nazwa": user.nazwa,
                "ranga": user.ranga_rel.nazwa if user.ranga_rel else "Brak rangi",
                "wiek": user.wiek,
                "waga": user.waga,
                "plec": "Mężczyzna" if user.plec else "Kobieta",
                "mail": user.mail
            }
        return None

    @staticmethod
    def get_completed_achievements(uzytkownik_id):
        """Metoda zwracająca ukończone osiągnięcia użytkownika"""
        user = Uzytkownik.query.get(uzytkownik_id)
        if user:
            completed_achievements = []
            for completed in user.ukonczone_osiagniecia_rel:
                achievement = completed.osiagniecie  # Odwołanie do osiągnięcia
                completed_achievements.append({
                    "nazwa_osiagniecia": achievement.nazwa_osiagniecia,
                    "data_ukonczenia": completed.data.strftime('%Y-%m-%d') if completed.data else None
                })
            return completed_achievements
        return []
    
    @staticmethod
    def get_waga(uzytkownik_id):
        user = Uzytkownik.query.get(uzytkownik_id)
        return user.waga if user else None

    @staticmethod
    def get_plec(uzytkownik_id):
        user = Uzytkownik.query.get(uzytkownik_id)
        return user.plec if user else None
    
    @staticmethod
    def get_user_history_24h(uzytkownik_id):
        try:
            # Obliczenie daty sprzed 24h
            now = datetime.utcnow()
            last_24h = now - timedelta(days=1)

            # Pobieranie historii użytkownika z ostatnich 24 godzin
            historia = Historia.query.filter(
                Historia.id_uzytkownika == uzytkownik_id,
                Historia.data >= last_24h
            ).all()

            if not historia:
                return {"message": "Brak historii w ostatnich 24 godzinach."}, 404

            # Przygotowanie danych do zwrócenia
            historia_data = []
            for record in historia:
                alkohol = record.alkohol
                historia_data.append({
                    "nazwa_alkoholu": alkohol.nazwa_alkoholu,
                    "zawartosc_procentowa": alkohol.zawartosc_procentowa,
                    "ilosc_wypitego_ml": record.ilosc_wypitego_ml,
                    "data": record.data.strftime('%Y-%m-%d %H:%M:%S')
                })

            # Wywołanie funkcji obliczającej promile na podstawie wypitego alkoholu
            from alcohol_utils import calculate_bac
            promile, stan = calculate_bac(uzytkownik_id, historia_data)

            return {
                "promile": promile,
                "stan": stan
            }

        except Exception as e:
            return {"error": str(e)}, 500