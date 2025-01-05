from . import db
from .RodzajAlkoholu import RodzajAlkoholu
from .Ulubione import Ulubione
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