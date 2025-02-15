from api.app.core.models import Catalog
from api.app.utils.repository import SQLAlchemyRepository


class TikketRepository(SQLAlchemyRepository):
    model = Catalog
