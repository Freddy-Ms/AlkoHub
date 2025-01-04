from . import db
class RangaUzytkownika(db.Model):
    __tablename__ = 'rangi_uzytkownika'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(15), nullable=False)