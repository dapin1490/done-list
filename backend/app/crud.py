from sqlalchemy.orm import Session, joinedload
from typing import Optional
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

# Like CRUD
def toggle_like(db: Session, done_id: int, user_id: int) -> Optional[models.Like]:
    like = db.query(models.Like).filter(
        models.Like.done_id == done_id,
        models.Like.user_id == user_id
    ).first()
    
    if like:
        db.delete(like)
        db.commit()
        return None
    
    new_like = models.Like(done_id=done_id, user_id=user_id)
    db.add(new_like)
    db.commit()
    db.refresh(new_like)
    return new_like

# Done CRUD
def get_public_dones(db: Session, skip: int = 0, limit: int = 100, current_user_id: Optional[int] = None):
    dones = db.query(models.Done).options(
        joinedload(models.Done.owner),
        joinedload(models.Done.likes)
    ).order_by(models.Done.created_at.desc()).offset(skip).limit(limit).all()

    # Manually attach the computed properties. Pydantic's orm_mode will handle it.
    for done in dones:
        done.likes_count = len(done.likes)
        done.is_liked = any(like.user_id == current_user_id for like in done.likes) if current_user_id else False
        
    return dones

def get_dones_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Done)
        .filter(models.Done.owner_id == user_id)
        .order_by(models.Done.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

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