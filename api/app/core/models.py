# models.py
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.dialects.postgresql import ARRAY
from api.app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class Favorites(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    photo = Column(String, nullable=False)
    text = Column(String, nullable=False)
    rating = Column(Float, nullable=False)




class Catalog(Base):
    __tablename__ = "catalogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    information = Column(ARRAY(String), nullable=False)
    image = Column(String, nullable=True)
    location = Column(String, nullable=False)
    rating = Column(Float, nullable=False)



