from fastapi import FastAPI
import httpx


app = FastAPI()


@app.get("/news")
async def news():
  async with httpx.AsyncClient() as client:
    r = await client.get("https://example.com")
  return {"status": "fetched"}