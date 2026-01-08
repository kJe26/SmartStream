import json
import time
from fastapi import FastAPI
import pika


def callback(ch, method, properties, body):
    data = json.loads(body)
    print("News received:", data)

while True:
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
        channel = connection.channel()
        channel.queue_declare(queue="content")
        channel.basic_consume(queue="content", on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
    except Exception:
        time.sleep(5)