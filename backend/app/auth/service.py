from sqlalchemy.orm import Session
from app.database.models import User
from app.auth.hashing import hash_password, verify_password
from app.auth.schemas import RegisterRequest

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, data: RegisterRequest) -> User:
    hashed = hash_password(data.password)
    user = User(email=data.email, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user