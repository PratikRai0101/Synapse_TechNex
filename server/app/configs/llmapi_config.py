import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class ChatConfig:
    API_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_NAME = 'gemini-2.5-flash' 

    """
    This is System Prompt for GEMNI chatbot RAG
    """
    SYSTEM_PROMPT = "You are a helpful AI assistant."
    MAX_HISTORY = 10

    @classmethod
    def initialize_ai(cls):
        try:
            genai.configure(api_key=cls.API_KEY)
            return genai.GenerativeModel(
                model_name=cls.MODEL_NAME,
                system_instruction=cls.SYSTEM_PROMPT
            )
        except Exception as e:
            print(f"Failed to initialize Gemini: {e}")
            raise

AI_MODEL = ChatConfig.initialize_ai()