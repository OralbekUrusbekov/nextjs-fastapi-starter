from pydantic import BaseModel
from typing import Optional, List
from fastapi import UploadFile


class CatalogBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: int
    information: Optional[List[str]] = None
    location: Optional[str] = None
    rating: Optional[float] = None

    class Config:
        from_attributes = True


class Tikket(BaseModel):
    title: str
    description: Optional[str] = None
    price: int
    information: Optional[List[str]] = None
    location: Optional[str] = None
    rating: Optional[float] = None
    image: Optional[UploadFile] = None

    class Config:
        from_attributes = True


class CatalogUpdate2(BaseModel):
    title: str
    description: Optional[str] = None
    price: int
    information: Optional[List[str]] = None
    location: Optional[str] = None
    rating: Optional[float] = None
    image: str = None

    class Config:
        from_attributes = True

class CatalogUpdate(CatalogBase):
    image: Optional[UploadFile] = None


class CatalogOut(CatalogBase):
    id: int
    image: Optional[str] = None
