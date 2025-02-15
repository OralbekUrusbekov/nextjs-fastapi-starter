#shemas.py
from pydantic import BaseModel, EmailStr

# Жаңа пайдаланушыны тіркеу схемасы
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

    class Config:
        from_attributes = True

# Пайдаланушыны алу үшін (Login)
class GetToken(BaseModel):
    email: EmailStr
    password: str

# Reset password үшін сұрау схемасы
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
