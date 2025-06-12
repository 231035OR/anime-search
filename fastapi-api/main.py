class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "ja"

@app.post("/translate")
async def translate(req: TranslateRequest):
    payload = {
        "q": req.text,
        "source": "en",
        "target": req.target_lang,
        "format": "text"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("https://libretranslate.de/translate", data=payload)
    if response.status_code != 200:
        return JSONResponse(status_code=response.status_code, content={"error": "Translation failed"})
    return response.json()  # -> { "translatedText": "..." }
