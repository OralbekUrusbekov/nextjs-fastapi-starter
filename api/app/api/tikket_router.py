from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


from api.app.api.dependencies import get_tikket_service
from api.app.db.database import get_async_session
from api.app.core.models import Catalog
from api.app.repositories.tikket_repo import TikketRepository
from api.app.schemas.tikket_shemas import CatalogOut, CatalogUpdate2, Tikket
import shutil
import os
import json
from PIL import Image
from api.app.services.tikket_service import TikketServise

router = APIRouter(
    prefix="/catalogs",
    tags=["catalogs"]
)

UPLOAD_DIRECTORY = "uploads/"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

async def save_image(image: UploadFile) -> str:
    try:
        webp_filename = os.path.splitext(image.filename)[0] + ".webp"
        webp_path = os.path.join(UPLOAD_DIRECTORY, webp_filename)

        img = Image.open(image.file)
        img = img.convert("RGB")
        img.save(webp_path, "WEBP", quality=80)

        return webp_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving WebP image: {str(e)}")


@router.post("/")
async def create_catalog(
        title: str = Form(...),
        description: str = Form(...),
        price: str = Form(...),
        location: str = Form(...),
        rating: str = Form(...),
        information: str = Form(...),
        image: UploadFile = File(...),
        tikket_services: TikketServise = Depends(get_tikket_service)
):
    try:
        try:
            rating = float(rating)
            price = int(price)
            information_list = json.loads(information.strip("'"))
            image_path = await save_image(image)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid exchange value and image")

        new_catalog = CatalogUpdate2(
            title=title,
            description=description,
            price=price,
            information=information_list,
            image=image_path,
            location=location,
            rating=rating
        )
        responces = await tikket_services.add_tikket(new_catalog)
        return {"tikket_id": responces}

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for information field")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/", response_model=list[CatalogOut])
async def get_all_catalogs(tikket_services: TikketServise = Depends(get_tikket_service)):
    try:
        result = await tikket_services.get_tikket()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching catalogs: {str(e)}")


@router.get("/{catalog_id}", response_model=CatalogOut)
async def get_catalog(catalog_id: int, tikket_services: TikketServise = Depends(get_tikket_service)):
    try:
        catalog = await tikket_services.get_tikket_one(catalog_id)
        return catalog
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching catalog: {str(e)}")



@router.put("/{catalog_id}")
async def update_catalog(
        catalog_id: int,
        title: str = Form(...),
        description: str = Form(...),
        price: str = Form(...),
        location: str = Form(...),
        rating: str = Form(...),
        information: str = Form(...),
        image: UploadFile = File(None),
        tikket_services: TikketServise = Depends(get_tikket_service)
):
    try:
        try:
            rating = float(rating)
            price = int(price)
            information_list = json.loads(information.strip("'"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid price or rating format")

        catalog = await tikket_services.get_tikket_one(catalog_id)

        if image:
            if catalog.image and os.path.exists(catalog.image):
                os.remove(catalog.image)
            image_path = await save_image(image)
        else:
            image_path = catalog.image

        updated_catalog = CatalogUpdate2(
            title=title,
            description=description,
            price=price,
            location=location,
            rating=rating,
            information=information_list,
            image=image_path
        )

        result = await tikket_services.update_tikket_one(updated_catalog, catalog_id)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while updating: {str(e)}")


@router.delete("/{catalog_id}")
async def delete_catalog(catalog_id: int,  tikket_services: TikketServise = Depends(get_tikket_service), ):
    try:
        catalog = await tikket_services.get_tikket_one(catalog_id)
        if catalog.image and os.path.exists(catalog.image):
            os.remove(catalog.image)
        result = await tikket_services.delete_tikket_one(catalog_id)
        return {"message": "Catalog deleted successfully","result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting catalog: {str(e)}")

