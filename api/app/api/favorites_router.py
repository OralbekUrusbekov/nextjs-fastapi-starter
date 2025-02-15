from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from api.app.api.dependencies import get_favorite_service
from api.app.schemas.favorite_shemas import FavoritesOut, FavoritesBase
import shutil
import os
import json
import logging
from api.app.services.favorite_service import FavoriteServise

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/favorites",
    tags=["favorites"]
)

UPLOAD_DIRECTORY = "favorite/"
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


@router.post("/")
async def create_catalog_item(
        name: str = Form(...),
        photo: UploadFile = File(...),
        text: str = Form(...),
        rating: str = Form(...),
        favorite_services: FavoriteServise = Depends(get_favorite_service)):
    try:
        rating = int(rating)
        photo_path = await save_image(photo)
        new_item = FavoritesBase(
            name=name,
            photo=photo_path,
            text=text,
            rating=rating
        )
        responses = await favorite_services.add_favorite(new_item)
        return {"favorite_id": responses}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for information field")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/", response_model=list[FavoritesOut])
async def get_all_catalog_items(favorite_services: FavoriteServise = Depends(get_favorite_service)):
    try:
        items = await favorite_services.get_favorite()
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching catalogs: {str(e)}")


@router.get("/{item_id}", response_model=FavoritesOut)
async def get_catalog_item(item_id: int, favorite_services: FavoriteServise = Depends(get_favorite_service)):
    try:
        items = await favorite_services.get_favorite_one(item_id)
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching catalog: {str(e)}")


@router.put("/{item_id}")
async def update_catalog_item(
        item_id: int,
        name: str = Form(...),
        text: str = Form(...),
        rating: str = Form(...),
        photo: UploadFile = File(None),
        favorite_services: FavoriteServise = Depends(get_favorite_service)):
    try:
        try:
            rating = int(rating)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid rating value")

        item = await favorite_services.get_favorite_one(item_id)

        if photo:
            if item.photo and os.path.exists(item.photo):
                os.remove(item.photo)
            image_path = await save_image(photo)
        else:
            image_path = item.photo

        new_item = FavoritesBase(
            name=item.name,
            text=item.text,
            rating=item.rating,
            photo=image_path
        )

        results = await favorite_services.update_favorite_one(new_item, item_id)

        return results
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for information field")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.delete("/{item_id}")
async def delete_catalog_item(item_id: int, favorite_services: FavoriteServise = Depends(get_favorite_service)):
    try:
        item = await favorite_services.get_favorite_one(item_id)

        if item.photo and os.path.exists(item.photo):
            os.remove(item.photo)
        result = await favorite_services.delete_favorite_one(item_id)
        return {"message": "Catalog item deleted successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting catalog: {str(e)}")
