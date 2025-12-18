from fastapi import FastAPI
from app.router.chatbot_router import router as chatbot_router

app = FastAPI(title="Secure Modular Chatbot")
app.include_router(chatbot_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)