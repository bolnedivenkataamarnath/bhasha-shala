from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.services.translation_service import translation_service


app = FastAPI(title="Bhasha Shala API")


# Allow the React frontend to communicate with FastAPI
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
    source_language: str = "English"
    target_languages: list[str] = ["Santali"]


@app.get("/")
def root():
    return {
        "message": "Bhasha Shala backend is running!"
    }


@app.post("/translate")
def translate(request: TranslationRequest):

    translations = translation_service.translate_multiple(
        request.text,
        source_lang=request.source_language,
        target_langs=request.target_languages,
    )

    return {
        "source_text": request.text,
        "source_language": request.source_language,
        "target_languages": request.target_languages,
        "translations": translations,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=False
    )