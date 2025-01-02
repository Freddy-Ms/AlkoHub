# models/models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
class Uzytkownik(db.Model):
    __tablename__ = 'uzytkownicy'
    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(15), nullable=False, unique=True)
    mail = db.Column(db.String(50), nullable=False, unique=True)
    haslo = db.Column(db.String(255), nullable=False)
    waga = db.Column(db.Float, nullable=True)
    wiek = db.Column(db.Integer, nullable=True)
    plec = db.Column(db.Boolean, nullable=True)
    ranga = db.Column(db.Integer, default=1) 

class Alkohol(db.Model):
    __tablename__ = 'alkohole'

    id = db.Column(db.Integer, primary_key=True)
    rodzaj_alkoholu = db.Column(db.Integer, db.ForeignKey('rodzaje_alkoholi.id'))  # Klucz obcy do tabeli 'rodzaje_alkoholi'
    nazwa_alkoholu = db.Column(db.String(30), nullable=False)
    opis_alkoholu = db.Column(db.Text)
    zawartosc_procentowa = db.Column(db.Float)
    rok_produkcji = db.Column(db.Integer)
    image_url = db.Column(db.String(255))

    # Relacja z tabelą rodzaje_alkoholi
    rodzaj_alkoholu_rel = db.relationship('RodzajAlkoholu', backref='alkohole')

class RodzajAlkoholu(db.Model):
    __tablename__ = 'rodzaje_alkoholi'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(255), nullable=False)
