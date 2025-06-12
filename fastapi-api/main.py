from fastapi import FastAPI, Query
import httpx
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では制限する
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JIKAN_API_BASE = "https://api.jikan.moe/v4"

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

# ✅ 追加：LibreTranslate API を使った翻訳エンドポイント
@app.post("/translate")
async def translate(text: str = Query(...), target_lang: str = Query("ja")):
    payload = {
        "q": text,
        "source": "en",
        "target": target_lang,
        "format": "text"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("https://libretranslate.de/translate", data=payload)
    if response.status_code != 200:
        return JSONResponse(status_code=response.status_code, content={"error": "Translation failed"})
    return response.json()
