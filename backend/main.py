from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.translation_service import translation_service


app = FastAPI(title="Bhasha Shala API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "sat"


@app.get("/")
def root():
    return {
        "message": "Bhasha Shala backend is running!"
    }


@app.post("/translate")
def translate(request: TranslationRequest):

    translated_text = translation_service.translate(
        request.text,
        source_lang=request.source_lang,
        target_lang=request.target_lang,
    )

    return {
        "source_text": request.text,
        "source_lang": request.source_lang,
        "target_lang": request.target_lang,
        "translated_text": translated_text,
    }