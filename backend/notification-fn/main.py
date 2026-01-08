from fastapi import FastAPI
import redis.asyncio as redis

app = FastAPI()
r = redis.Redis(host="redis", port=6379)

@app.post("/invoke")
async def invoke(event: dict):
    await r.publish("events", f"FaaS processed: {event}")
    return {"status": "done"}