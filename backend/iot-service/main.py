import asyncio
import json
import logging
from fastapi import FastAPI
from gmqtt import Client as MQTT
from nats.aio.client import Client as NATS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

nats = NATS()
mqtt_task: asyncio.Task | None = None
mqtt_client = MQTT("iot-service")

@app.on_event("startup")
async def startup():
    await mqtt_client.connect("mqtt-broker", 1883)
    await nats.connect("nats://nats:4222")

    global mqtt_task
    mqtt_task = asyncio.create_task(mqtt_loop())

async def on_message(client, topic, payload, qos, properties):
    if topic.startswith("sensors/"):
        # payload = payload.decode()
        logger.info(f"Received MQTT message: {payload}")
        await nats.publish("iot.stream", payload)
        logger.info("Published to NATS")

def on_connect(client, flags, rc, properties):
    print('Connected')
    client.subscribe("sensors/#")
    logger.info("Subscribed to sensors/#")

async def mqtt_loop():
    try:
        client = MQTT("mqtt-broker")
        client.on_message = on_message

        client.on_connect = on_connect
        await client.connect("mqtt-broker", 1883)

        # Keep the loop alive to receive messages
        await asyncio.Event().wait()

    except Exception:
        logger.exception("MQTT loop failed")

@app.on_event("shutdown")
async def shutdown():
    mqtt_client.disconnect()
    if mqtt_task:
        mqtt_task.cancel()
    await nats.close()

@app.post("/telemetry")
async def telemetry(payload: dict):
    await mqtt_client.publish("sensors/demo", json.dumps(payload))
    return {"sent": True}