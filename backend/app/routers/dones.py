from fastapi import APIRouter, Depends, HTTPException, status, Response
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
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.create_user_done(db=db, done=done, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Done])
def read_dones_for_user(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    dones = crud.get_dones_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return dones

@router.put("/{done_id}", response_model=schemas.Done)
def update_user_done(
    done_id: int, 
    done_in: schemas.DoneUpdate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    db_done = crud.get_done(db, done_id=done_id)
    if not db_done:
        raise HTTPException(status_code=404, detail="Done not found")
    if db_done.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.update_done(db=db, db_done=db_done, done_in=done_in)


@router.delete("/{done_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_done(
    done_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    db_done = crud.get_done(db, done_id=done_id)
    if not db_done:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Done not found")
    if db_done.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
        
    crud.delete_done(db=db, db_done=db_done)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/{done_id}/like", response_model=schemas.DonePublic, tags=["likes"])
def toggle_like_on_done(
    done_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    db_done = crud.get_done(db, done_id=done_id)
    if not db_done:
        raise HTTPException(status_code=404, detail="Done not found")

    like = crud.toggle_like(db=db, db_done=db_done, user_id=current_user.id)
    
    # Re-fetch the done to get updated like count and status
    updated_done = crud.get_done_with_like_status(db=db, done_id=done_id, user_id=current_user.id)
    return updated_done

@router.get("/public/", response_model=List[schemas.DonePublic], tags=["dones-public"])
def read_public_dones(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """
    Retrieve all public dones.
    """
    dones = crud.get_public_dones(db, skip=skip, limit=limit)
    return dones 