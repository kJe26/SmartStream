from fastapi import FastAPI
import pika


app = FastAPI()


connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
channel = connection.channel()
channel.queue_declare(queue="content")


@app.post("/content")
def publish_content(content: dict):
  channel.basic_publish(
    exchange="",
    routing_key="content",
    body=str(content)
  )
  return {"published": True}