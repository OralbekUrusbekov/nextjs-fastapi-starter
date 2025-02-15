from fastapi import APIRouter, Depends
from fastapi import Response
from sqlalchemy.ext.asyncio import AsyncSession
from api.app.db.database import get_async_session
from api.app.services.auth_service import register_user, login_user, forget_password, reset_password
from api.app.schemas.auth_schemas import UserCreate, GetToken, ResetPasswordRequest

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/register")
async def register_route(user_data: UserCreate, db: AsyncSession = Depends(get_async_session)):
    return await register_user(user_data, db)


@router.post("/login")
async def login_route(user_data: GetToken, response: Response, db: AsyncSession = Depends(get_async_session)):
    return await login_user(user_data, response, db)



@router.post("/forget-password")
async def forgot_password_route(email: str, db: AsyncSession = Depends(get_async_session)):
    return await forget_password(email, db)


@router.post("/reset-password")
async def reset_password_route(request: ResetPasswordRequest, db: AsyncSession = Depends(get_async_session)):
    return await reset_password(request.token, request.new_password, db)
