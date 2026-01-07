from fastapi import FastAPI
import redis


app = FastAPI()
cache = redis.Redis(host="redis", port=6379)


@app.post("/users")
def create_user(user: dict):
  cache.set(user["id"], user["name"])
  return user