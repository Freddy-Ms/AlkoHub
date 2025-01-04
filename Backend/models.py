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
    ranga = db.Column(db.Integer, db.ForeignKey('rangi_uzytkownika.id'), default=1)

    # Relacja do rangi
    ranga_rel = db.relationship('RangaUzytkownika', backref='uzytkownicy')

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

class Historia(db.Model):
    __tablename__ = 'historia'

    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownicy.id'), primary_key=True)
    id_alkoholu = db.Column(db.Integer, db.ForeignKey('alkohole.id'), primary_key=True)
    data = db.Column(db.DateTime, primary_key=True)
    ilosc_wypitego_ml = db.Column(db.Integer, nullable=False)

    # Relacje
    uzytkownik = db.relationship('Uzytkownik', backref='historia')
    alkohol = db.relationship('Alkohol', backref='historia')


class Opinia(db.Model):
    __tablename__ = 'opinie'

    id_alkoholu = db.Column(db.Integer, db.ForeignKey('alkohole.id'), primary_key=True)
    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownicy.id'), primary_key=True)
    znacznik_czasu = db.Column(db.DateTime, primary_key=True)
    ocena = db.Column(db.Integer, nullable=True, check_constraint='ocena >= 1 AND ocena <= 5')
    recenzja = db.Column(db.Text, nullable=True)

    # Relacje
    alkohol = db.relationship('Alkohol', backref='opinie')
    uzytkownik = db.relationship('Uzytkownik', backref='opinie')


class Osiagniecie(db.Model):
    __tablename__ = 'osiagniecia'

    id_osiagniecia = db.Column(db.Integer, primary_key=True)
    rodzaj_alkoholu = db.Column(db.Integer, db.ForeignKey('rodzaje_alkoholi.id'))
    nazwa_osiagniecia = db.Column(db.String(30), nullable=False)
    opis_osiagniecia = db.Column(db.Text, nullable=True)
    ilosc_wymagana_ml = db.Column(db.Integer, nullable=False)

    # Relacje
    rodzaj_alkoholu_rel = db.relationship('RodzajAlkoholu', backref='osiagniecia')


class UkonczoneOsiagniecie(db.Model):
    __tablename__ = 'ukonczone_osiagniecia'

    id_osiagniecia = db.Column(db.Integer, db.ForeignKey('osiagniecia.id_osiagniecia'), primary_key=True)
    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownicy.id'), primary_key=True)
    data = db.Column(db.Date, nullable=True)

    # Relacje
    osiagniecie = db.relationship('Osiagniecie', backref='ukonczone')
    uzytkownik = db.relationship('Uzytkownik', backref='ukonczone_osiagniecia')


class Ulubione(db.Model):
    __tablename__ = 'ulubione'

    id_uzytkownika = db.Column(db.Integer, db.ForeignKey('uzytkownicy.id'), primary_key=True)
    id_alkoholu = db.Column(db.Integer, db.ForeignKey('alkohole.id'), primary_key=True)

    # Relacje
    uzytkownik = db.relationship('Uzytkownik', backref='ulubione')
    alkohol = db.relationship('Alkohol', backref='ulubione')


class RangaUzytkownika(db.Model):
    __tablename__ = 'rangi_uzytkownika'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(15), nullable=False)