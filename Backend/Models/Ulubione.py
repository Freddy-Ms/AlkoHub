from . import db
class Ulubione(db.Model):
    __tablename__ = 'ulubione'

    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownicy.id'), primary_key=True)
    id_alkoholu = db.Column(db.Integer, db.ForeignKey('alkohole.id'), primary_key=True)

    uzytkownik = db.relationship('Uzytkownik', backref='ulubione')
    alkohol = db.relationship('Alkohol', backref='ulubione')
