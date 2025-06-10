# fastapi-api/main.py
from fastapi import FastAPI, Query
import httpx

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # セキュリティ上は本番で制限してください
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()

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
