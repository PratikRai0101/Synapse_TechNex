from sqlalchemy import Column, Integer, String
from app.db import Base

class MessageModel(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    role = Column(String) 
    content = Column(String)