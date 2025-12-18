from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class MessageModel(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    role = Column(String) 
    content = Column(String)


class DatabaseManager:
    def __init__(self, db_url="sqlite:///./chat_history.db"):
        self.engine = create_engine(db_url, connect_args={"check_same_thread": False})
        self.SessionLocal = sessionmaker(bind=self.engine)
        Base.metadata.create_all(bind=self.engine)

    def get_session(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

db_manager = DatabaseManager()