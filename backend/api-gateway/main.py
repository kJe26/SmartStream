from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from shared.auth import verify_token
import httpx
import redis.asyncio as redis


app = FastAPI()
r = redis.Redis(host="redis", port=6379)


app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health")
def health():
  return {"status": "ok"}


@app.get("/secure-data")
def secure_data(user=Depends(verify_token)):
    return {"message": f"Hello {user['user_id']}"}


@app.websocket("/ws/notifications")
async def notifications(ws: WebSocket):
    await ws.accept()
    pubsub = r.pubsub()
    await pubsub.subscribe("events")

    async for msg in pubsub.listen():
        if msg["type"] == "message":
            await ws.send_text(msg["data"].decode())


@app.get("/contents")
async def contents():
    async with httpx.AsyncClient() as client:
        r = await client.get("http://content-service:8000/contents")
        return r.json()
    

@app.post("/content")
async def publish_content(payload: dict):
    async with httpx.AsyncClient() as client:
        r = await client.post("http://content-service:8000/content", json=payload)
        return r.json()


@app.post("/telemetry")
async def telemetry(payload: dict):
    async with httpx.AsyncClient() as client:
        await client.post("http://iot-service:8000/telemetry", json=payload)
    return {"forwarded": True}


@app.post("/users")
async def create_user(user: dict):
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.post("http://user-service:8000/users", json=user)
        return r.json()


@strawberry.type
class Query:
    @strawberry.field
    async def contents(self) -> list[str]:
        async with httpx.AsyncClient() as client:
            r = await client.get("http://content-service:8000/contents")
        return r.json()


schema = strawberry.Schema(Query)
app.include_router(GraphQLRouter(schema), prefix="/graphql")