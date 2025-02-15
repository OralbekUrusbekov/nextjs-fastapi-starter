import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from jose import jwt
from api.app.core.models import User
from api.app.schemas.auth_schemas import UserCreate, GetToken
import secrets
from api.app.config import SECRET_KEY, ALGORITHM, SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASS

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def register_user(user_data: UserCreate, db: AsyncSession):
    hashed_password = get_password_hash(user_data.password)
    user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def login_user(user_data: GetToken, response: Response, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalars().first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(data={"name": user.first_name, "email": user.email})


    return {"access_token": access_token, "token_type": "bearer"}


def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        print("Email sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")


async def forget_password(email: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    db.add(user)
    await db.commit()

    reset_link = f"http://localhost:8000/reset-password?token={reset_token}"  # URL жасау
    send_email(user.email, "Password Reset Request", f"Click here to reset your password: {reset_link}")

    return {"message": "Password reset link sent to your email"}


async def reset_password(reset_token: str, new_password: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.reset_token == reset_token))
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    user.hashed_password = get_password_hash(new_password)
    user.reset_token = None  # Токенді жою
    db.add(user)
    await db.commit()

    send_email(user.email, "Password Reset Successful", "Your password has been successfully reset.")

    return {"message": "Password reset successful"}
