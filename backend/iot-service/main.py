import asyncio
import logging
from fastapi import FastAPI
from gmqtt import Client as MQTTClient


app = FastAPI()
client = MQTTClient("iot-service")


@app.on_event("startup")
async def start():
    for attempt in range(10):
        try:
            await client.connect("mqtt-broker", 1883)
            logging.info("Connected to MQTT broker")
            return
        except Exception as e:
            logging.warning(f"MQTT not ready, retrying ({attempt + 1}/10)")
            await asyncio.sleep(2)

    raise RuntimeError("Could not connect to MQTT broker")


@app.post("/telemetry")
async def telemetry(data: dict):
  client.publish("devices/telemetry", str(data))
  return {"sent": True}