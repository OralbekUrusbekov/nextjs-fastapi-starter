from fastapi import HTTPException
from api.app.schemas.tikket_shemas import CatalogUpdate2, Tikket, CatalogOut
from api.app.utils.repository import AbstractRepository


class TikketServise:
    def __init__(self, favorite_repository: AbstractRepository):
        self.favorite_repos: AbstractRepository = favorite_repository

    async def add_tikket(self, tikket: Tikket):
        tikket_id = await self.favorite_repos.add_one(tikket.model_dump())
        return tikket_id

    async def get_tikket(self):
        data = await self.favorite_repos.find_all()
        return data

    async def get_tikket_one(self, tik_id: int):
        data = await self.favorite_repos.find_by_id(tik_id)
        if not data:
            raise HTTPException(status_code=404, detail="Catalog not found")
        return data

    async def update_tikket_one(self, tikket: CatalogUpdate2, tik_id: int) -> bool:
        data = await self.favorite_repos.update_one(tik_id, tikket)
        return data

    async def delete_tikket_one(self, tik_id: int):
        data = await self.favorite_repos.delete_one(tik_id)
        return data

