from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True)
    is_active = Column(Boolean, default=True)
    role = Column(String, default='user')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    dones = relationship("Done", back_populates="owner", cascade="all, delete-orphan")


class Done(Base):
    __tablename__ = "dones"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True, nullable=False)
    tags = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="dones")

# class Tag(Base):
#     __tablename__ = "tags"
    
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, unique=True, index=True, nullable=False)

#     dones = relationship("Done", secondary=done_tags, back_populates="tags")

# class Feedback(Base):
#     __tablename__ = "feedbacks"

#     id = Column(Integer, primary_key=True, index=True)
#     comment = Column(String)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     author_id = Column(Integer, ForeignKey("users.id"))
#     done_entry_id = Column(Integer, ForeignKey("done_entries.id"))

#     author = relationship("User", back_populates="feedbacks")
#     done_entry = relationship("DoneEntry", back_populates="feedbacks")

# class Notification(Base):
#     __tablename__ = "notifications"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     message = Column(String, nullable=False)
#     is_read = Column(Boolean, default=False)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     user = relationship("User") 