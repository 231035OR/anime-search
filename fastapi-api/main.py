from fastapi import FastAPI, Query
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JIKAN_API_BASE = "https://api.jikan.moe/v4"
LIBRETRANSLATE_URL = "https://libretranslate.de/translate"  # 公開サーバー

@app.get("/search_anime")
async def search_anime(q: str = Query(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{JIKAN_API_BASE}/anime", params={"q": q})
    return response.json()

@app.get("/anime_detail/{anime_id}")
async def anime_detail(anime_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{JIKAN_API_BASE}/anime/{anime_id}")
    return response.json()

@app.post("/translate")
async def translate_text(text: str, target_lang: str = "ja", source_lang: str = "en"):
    payload = {
        "q": text,
        "source": source_lang,
        "target": target_lang,
        "format": "text"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(LIBRETRANSLATE_URL, data=payload)
        response.raise_for_status()
        return response.json()
