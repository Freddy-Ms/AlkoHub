from . import db
class RangaUzytkownika(db.Model):
    __tablename__ = 'rangi_uzytkownika'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(15), nullable=False)

    @staticmethod
    def get_all_roles():
        # Pobierz wszystkie rangi z bazy danych
        rangas = RangaUzytkownika.query.all()

        # Przygotuj listę rang z ich id i nazwą
        result = [{'id': ranga.id, 'nazwa': ranga.nazwa} for ranga in rangas]

        return result