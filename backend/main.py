from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .app.database import Base, engine
from .app.routers import dones, users

# This will create the tables in the database
# For production, you should use a migration tool like Alembic
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Done List API",
    description="API for the Done List application.",
    version="1.0.0",
)

# Set up CORS
origins = [
    "http://localhost:5173",  # React default dev port
    "http://localhost:3000",  # Another common dev port
    # Add your deployed frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api")
app.include_router(dones.router, prefix="/api")

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Done List API!"} 