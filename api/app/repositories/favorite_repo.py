from api.app.core.models import  Favorites
from api.app.utils.repository import SQLAlchemyRepository


class FavoriteRepository(SQLAlchemyRepository):
    model = Favorites
