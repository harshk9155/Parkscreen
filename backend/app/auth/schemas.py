from pydantic import BaseModel, EmailStr

# What the client sends to /auth/register
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

# What the client sends to /auth/login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# What we send back to the client
class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True