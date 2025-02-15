import json
from typing import List
from fastapi import HTTPException
from api.app.schemas.tikket_shemas import CatalogUpdate2, Tikket, CatalogOut
from api.app.utils.repository import AbstractRepository


class FavoriteServise:
    def __init__(self, tikket_repository: AbstractRepository):
        self.tikket_repos: AbstractRepository = tikket_repository

    async def add_favorite(self, tikket: Tikket):
        tikket_id = await self.tikket_repos.add_one(tikket.model_dump())
        return tikket_id

    async def get_favorite(self):
        data = await self.tikket_repos.find_all()
        if not data:
            raise HTTPException(status_code=404, detail="Catalog not found")
        return data

    async def get_favorite_one(self, fav_id: int):
        data = await self.tikket_repos.find_by_id(fav_id)
        if not data:
            raise HTTPException(status_code=404, detail="Catalog not found")
        return data

    async def update_favorite_one(self, tikket: CatalogUpdate2, fav_id: int) -> bool:
        data = await self.tikket_repos.update_one(fav_id, tikket)
        return data

    async def delete_favorite_one(self, fav_id: int):
        data = await self.tikket_repos.delete_one(fav_id)
        return data
