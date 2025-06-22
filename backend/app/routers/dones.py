from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, models, schemas
from app.dependencies import get_db, get_current_active_user

router = APIRouter(
    prefix="/dones",
    tags=["dones"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Done)
def create_done_for_user(
    done: schemas.DoneCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_active_user)
):
    return crud.create_user_done(db=db, done=done, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Done])
def read_dones_for_user(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    dones = crud.get_dones_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return dones

@router.put("/{done_id}", response_model=schemas.Done)
def update_user_done(
    done_id: int, 
    done_in: schemas.DoneUpdate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_done = crud.get_done(db, done_id=done_id)
    if db_done is None:
        raise HTTPException(status_code=404, detail="Done not found")
    if db_done.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.update_done(db=db, db_done=db_done, done_in=done_in)


@router.delete("/{done_id}", response_model=schemas.Done)
def delete_user_done(
    done_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_done = crud.get_done(db, done_id=done_id)
    if db_done is None:
        raise HTTPException(status_code=404, detail="Done not found")
    if db_done.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.delete_done(db=db, db_done=db_done) 