import enum
from sqlalchemy import (Column, Integer, String, DateTime, Boolean, ForeignKey, Table, Enum)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class UserRole(enum.Enum):
    USER = "user"
    ADMIN = "admin"

done_tags = Table('done_tags', Base.metadata,
    Column('done_entry_id', Integer, ForeignKey('done_entries.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.USER)

    dones = relationship("DoneEntry", back_populates="owner")
    feedbacks = relationship("Feedback", back_populates="author")

class DoneEntry(Base):
    __tablename__ = "done_entries"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_public = Column(Boolean, default=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="dones")
    tags = relationship("Tag", secondary=done_tags, back_populates="dones")
    feedbacks = relationship("Feedback", back_populates="done_entry")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    dones = relationship("DoneEntry", secondary=done_tags, back_populates="tags")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    comment = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    author_id = Column(Integer, ForeignKey("users.id"))
    done_entry_id = Column(Integer, ForeignKey("done_entries.id"))

    author = relationship("User", back_populates="feedbacks")
    done_entry = relationship("DoneEntry", back_populates="feedbacks")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User") 