from fastapi import FastAPI
import asyncio
from nats.aio.client import Client as NATS
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("analytics-service")

app = FastAPI()
nc = NATS()

async def handler(msg):
    logger.info(f"Analytics event: {msg.data.decode()}")

@app.on_event("startup")
async def startup_event():
    await nc.connect("nats://nats:4222")
    await nc.subscribe("iot.stream", cb=handler)
    await nc.flush()
    logger.info("Analytics service ready, listening for messages...")