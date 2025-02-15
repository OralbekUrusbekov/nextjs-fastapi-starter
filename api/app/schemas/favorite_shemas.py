from fastapi import UploadFile
from pydantic import BaseModel, Field
from typing import Optional


class FavoritesBase(BaseModel):
    name: str
    photo: Optional[str] = None
    text: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)


class FavoritesOut(FavoritesBase):
    id: int

    class Config:
        from_attributes = True
