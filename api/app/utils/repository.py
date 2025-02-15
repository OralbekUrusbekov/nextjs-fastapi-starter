from abc import ABC, abstractmethod
from sqlalchemy import insert, select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, UploadFile
from api.app.db.database import async_session_maker
import os
import shutil

UPLOAD_DIRECTORY = "uploads/"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)


async def save_image(image: UploadFile) -> str:
    try:
        file_path = os.path.join(UPLOAD_DIRECTORY, image.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        return file_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")



class AbstractRepository(ABC):
    @abstractmethod
    async def add_one(self, data: dict) -> int:
        raise NotImplementedError

    @abstractmethod
    async def find_all(self):
        raise NotImplementedError

    @abstractmethod
    async def find_by_id(self, obj_id: int):
        raise NotImplementedError

    @abstractmethod
    async def update_one(self, obj_id: int, data: dict) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def delete_one(self, obj_id: int) -> bool:
        raise NotImplementedError


class SQLAlchemyRepository(AbstractRepository):
    model = None

    async def add_one(self, data: dict) -> int:
        async with async_session_maker() as session:
            stmt = insert(self.model).values(**data).returning(self.model.id)
            res = await session.execute(stmt)
            await session.commit()
            return res.scalar_one()

    async def find_all(self):
        async with async_session_maker() as session:
            stmt = select(self.model)
            res = await session.execute(stmt)
            return res.scalars().all()

    async def find_by_id(self, obj_id: int):
        async with async_session_maker() as session:
            stmt = select(self.model).where(self.model.id == obj_id)
            res = await session.execute(stmt)
            return res.scalars().first()

    async def update_one(self, obj_id: int, data: dict) -> bool:
        async with async_session_maker() as session:
            stmt = update(self.model).where(self.model.id == obj_id).values(**data.__dict__)
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount > 0

    async def delete_one(self, obj_id: int) -> bool:
        async with async_session_maker() as session:
            stmt = delete(self.model).where(self.model.id == obj_id)
            res = await session.execute(stmt)
            await session.commit()
            return
