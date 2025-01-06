from . import db
from sqlalchemy import CheckConstraint
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