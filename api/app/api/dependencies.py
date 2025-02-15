from api.app.repositories.favorite_repo import FavoriteRepository
from api.app.repositories.tikket_repo import TikketRepository
from api.app.services.favorite_service import FavoriteServise
from api.app.services.tikket_service import TikketServise


def get_favorite_service():
    return FavoriteServise(FavoriteRepository())


def get_tikket_service():
    return TikketServise(TikketRepository())

