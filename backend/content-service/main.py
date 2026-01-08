import json
from fastapi import FastAPI
import redis.asyncio as redis
import aio_pika

app = FastAPI()

r = redis.Redis(host="redis", port=6379)
contents = []

@app.post("/content")
async def publish_content(payload: dict):
    contents.append(payload)

    connection = await aio_pika.connect_robust("amqp://rabbitmq/")
    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue("content")

        await channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps(payload).encode()),
            routing_key=queue.name,
        )

    await r.publish("events", f"Content published: {payload['title']}")
    return {"status": "published"}


@app.get("/contents")
def get_contents():
    return contents