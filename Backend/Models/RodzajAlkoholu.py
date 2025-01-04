from . import db
class RodzajAlkoholu(db.Model):
    __tablename__ = 'rodzaje_alkoholi'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(255), nullable=False)