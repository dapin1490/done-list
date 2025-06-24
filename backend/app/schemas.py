from pydantic import BaseModel, EmailStr, root_validator
from typing import List, Optional
from datetime import datetime

# ====================
#       Like
# ====================
class LikeBase(BaseModel):
    done_id: int

class LikeCreate(LikeBase):
    pass

class Like(LikeBase):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True

# ====================
#       Done
# ====================

class DoneBase(BaseModel):
    text: str
    tags: Optional[List[str]] = []
    is_public: Optional[bool] = False

class DoneCreate(DoneBase):
    pass

class DoneUpdate(BaseModel):
    text: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None

class DoneInDB(DoneBase):
    id: int
    owner_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Public-facing Done schema
class Done(DoneBase):
    id: int
    created_at: datetime
    owner_id: int # To associate with a user if needed on the frontend
    is_public: bool = False

    class Config:
        orm_mode = True

# User Schemas
class UserPublic(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True

# New public schema for Dones that includes owner info
class DonePublic(Done):
    owner: UserPublic
    likes_count: int
    is_liked: bool

# ====================
#        User
# ====================

class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    role: str
    dones: List[Done] = []

    class Config:
        orm_mode = True

# ====================
#        Token
# ====================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Tag Schemas
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    
    class Config:
        orm_mode = True

# Feedback Schemas
class FeedbackBase(BaseModel):
    comment: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    done_entry_id: int

class Feedback(FeedbackBase):
    id: int
    author_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# DoneEntry Schemas
class DoneEntryBase(BaseModel):
    text: str
    is_public: Optional[bool] = True

class DoneEntryCreate(DoneEntryBase):
    tags: List[str] = []

class DoneEntry(DoneEntryBase):
    id: int
    owner_id: int
    created_at: datetime
    tags: List[Tag] = []
    feedbacks: List[Feedback] = []

    class Config:
        orm_mode = True 