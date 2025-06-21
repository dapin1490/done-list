from sqlalchemy.orm import Session
from . import models, schemas, security

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user

# Done CRUD
def get_dones_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Done).filter(models.Done.owner_id == user_id).offset(skip).limit(limit).all()

def create_user_done(db: Session, done: schemas.DoneCreate, user_id: int):
    db_done = models.Done(**done.dict(), owner_id=user_id)
    db.add(db_done)
    db.commit()
    db.refresh(db_done)
    return db_done

def get_done(db: Session, done_id: int):
    return db.query(models.Done).filter(models.Done.id == done_id).first()

def update_done(db: Session, db_done: models.Done, done_in: schemas.DoneUpdate):
    update_data = done_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_done, key, value)
    db.add(db_done)
    db.commit()
    db.refresh(db_done)
    return db_done

def delete_done(db: Session, db_done: models.Done):
    db.delete(db_done)
    db.commit()
    return db_done 