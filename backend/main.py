from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .app import models, schemas
from .app.database import engine, get_db

# This line creates the database tables.
# In a production app, you would use a migration tool like Alembic.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DONE List Community API",
    description="API for the DONE List Community, where users can record and share their achievements.",
    version="0.1.0",
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the DONE List API!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Example of using the database session
@app.get("/users/me", response_model=schemas.User)
def read_users_me(db: Session = Depends(get_db)):
    # This is a placeholder. Real logic will be implemented with authentication.
    user = db.query(models.User).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user 