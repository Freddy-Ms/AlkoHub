from . import db
from .RodzajAlkoholu import RodzajAlkoholu
from .Ulubione import Ulubione
from .Opinia import Opinia
from .Uzytkownik import Uzytkownik
class Alkohol(db.Model):
    __tablename__ = 'alkohole'

    id = db.Column(db.Integer, primary_key=True)
    rodzaj_alkoholu = db.Column(db.Integer, db.ForeignKey('rodzaje_alkoholi.id'))
    nazwa_alkoholu = db.Column(db.String(30), nullable=False)
    opis_alkoholu = db.Column(db.Text)
    zawartosc_procentowa = db.Column(db.Float)
    rok_produkcji = db.Column(db.Integer)
    image_url = db.Column(db.String(255))

    rodzaj_alkoholu_rel = db.relationship('RodzajAlkoholu', backref='alkohole')

    @staticmethod
    def get_products(categories=None):
        try:
            if categories:
                categories_list = categories.split(',')
                produkty = Alkohol.query.join(RodzajAlkoholu).filter(RodzajAlkoholu.nazwa.in_(categories_list)).all()
            else:
                produkty = Alkohol.query.all()

            result = [{"nazwa_alkoholu": a.nazwa_alkoholu, "zawartosc_procentowa": a.zawartosc_procentowa, "image_url": a.image_url, "id":a.id} for a in produkty]
            return result
        except Exception as e:
            return str(e)

    @staticmethod
    def get_favorite_drinks(uzytkownik_id, categories=None):
        try:
            if categories:
                categories_list = categories.split(',')
                ulubione = db.session.query(Alkohol).join(Ulubione).join(RodzajAlkoholu).filter(
                    Ulubione.id_uzytkownika == uzytkownik_id,
                    RodzajAlkoholu.nazwa.in_(categories_list)
                ).all()
            else:
                ulubione = db.session.query(Alkohol).join(Ulubione).filter(Ulubione.id_uzytkownika == uzytkownik_id).all()

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
            return ulubione_alkohole
        except Exception as e:
            return str(e)
        
    @staticmethod
    def get_product_details_with_reviews(product_id):
        try:
            # Pobranie szczegółów alkoholu
            alkohol = Alkohol.query.filter_by(id=product_id).first()
            if not alkohol:
                return {"message": "Nie znaleziono alkoholu o podanym ID."}, 404

            # Pobranie opinii na temat alkoholu
            opinie = Opinia.query.filter_by(id_alkoholu=product_id).join(Uzytkownik).all()

            # Słownik z danymi o alkoholu
            alkohol_data = {
                "nazwa": alkohol.nazwa_alkoholu,
                "rodzaj": alkohol.rodzaj_alkoholu_rel.nazwa if alkohol.rodzaj_alkoholu_rel else "Nieznany",
                "opis": alkohol.opis_alkoholu,
                "zawartosc_procentowa": alkohol.zawartosc_procentowa,
                "rok_produkcji": alkohol.rok_produkcji,
                "image_url": alkohol.image_url
            }

            # Słownik z opiniami
            opinie_data = []
            for opinia in opinie:
                opinie_data.append({
                    "znacznik_czasu": opinia.znacznik_czasu.strftime('%Y-%m-%d %H:%M:%S'),
                    "uzytkownik": opinia.uzytkownik.nazwa,
                    "ocena": opinia.ocena,
                    "recenzja": opinia.recenzja
                })

            # Obliczenie średniej oceny
            srednia_ocena = db.session.query(db.func.avg(Opinia.ocena)).filter(Opinia.id_alkoholu == product_id).scalar()
            srednia_ocena = round(srednia_ocena, 2) if srednia_ocena else None

            return {
                "alkohol": alkohol_data,
                "opinie": opinie_data,
                "srednia_ocena": srednia_ocena
            }, 200

        except Exception as e:
            return {"message": f"Błąd: {str(e)}"}, 500

