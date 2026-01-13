# Scalable Server-Side Notifications Using Redis Pub/Sub and WebSockets

## 1. Introduction

Modern web applications increasingly require **real-time server-side notifications**: updates that are pushed from the backend to connected clients without polling. Examples include content updates, alerts, IoT events, and collaborative applications.

In a **microservices architecture**, implementing real-time notifications in a scalable way is non-trivial. Multiple backend instances must be able to broadcast events to many connected clients without tight coupling.

This tutorial explains how to implement **scalable server-side notifications** using:

- **Redis Pub/Sub** as a distributed in-memory message bus
- **WebSockets** for real-time client communication
- **FastAPI** as the API Gateway
- A microservices-based backend

The tutorial is based on a **working implementation** published as a public Git repository.

---

## 2. Problem Statement

A naive WebSocket implementation works only when:
- There is a single backend instance
- All clients are connected to the same process

In a real system:
- Multiple API Gateway instances may run behind a load balancer
- Events may be produced by different microservices
- Clients must receive notifications regardless of which instance they are connected to

### Key Challenges
- Horizontal scalability
- Decoupling producers and consumers
- Low-latency message delivery
- Stateless backend services

---

## 3. Conceptual Background

### Redis Pub/Sub
Redis Pub/Sub allows services to:
- **Publish messages** to a channel
- **Subscribe** to channels and receive messages in real time

Characteristics:
- In-memory (low latency)
- Simple publish/subscribe semantics
- Ideal for transient events such as notifications

### WebSockets
WebSockets provide:
- Persistent, bidirectional communication
- Server-initiated messages
- Low overhead compared to HTTP polling

### Combined Approach
By combining Redis Pub/Sub with WebSockets:
- Any service can publish an event to Redis
- All API Gateway instances subscribed to Redis receive the event
- Each instance forwards the event to its connected WebSocket clients

This pattern enables **horizontal scalability**.

---

## 4. Architecture Overview

### High-Level Flow
1. A backend service produces an event
2. The event is published to a Redis channel
3. API Gateway instances subscribe to the channel
4. Events are pushed to clients via WebSockets

### Scalable server-side notifications using Redis Pub/Sub and WebSockets.
![Redis Pub/Sub + WebSocket Notification Architecture](diagrams/tutorial%20diagram.png)

---

## 5. System Architecture (Implementation Context)

Relevant components from the system:

- **API Gateway (FastAPI)**
  - Hosts WebSocket endpoint
  - Subscribes to Redis channels
- **Content Service**
  - Publishes events when new content is created
- **Notification Function (FaaS-style)**
  - Publishes processed events
- **Redis**
  - Acts as distributed in-memory event bus
- **Web Application (React)**
  - Subscribes to WebSocket notifications

---

## 6. Implementation Walkthrough

### 6.1 Publishing Events (Backend Service)

When new content is created, the Content Service publishes a notification:

```python
await redis.publish(
    "events",
    f"Content published: {payload['title']}"
)
```

This operation is:
- Non-blocking
- Independent of how many clients exist
- Decoupled from the API Gateway

---

### 6.2 Subscribing to Redis in the API Gateway

The API Gateway subscribes to the Redis channel:

```python
pubsub = redis.pubsub()
await pubsub.subscribe("events")
```

This subscription exists per API Gateway instance, enabling:
- Multiple instances to receive the same event
- Load-balanced WebSocket connections

---

### 6.3 WebSocket Endpoint

Clients connect to the WebSocket endpoint:

```python
@app.websocket("/ws/notifications")
async def notifications(ws: WebSocket):
    await ws.accept()
    async for msg in pubsub.listen():
        if msg["type"] == "message":
            await ws.send_text(msg["data"].decode())
```

Each connected client receives:
- Real-time notifications
- Without polling
- With minimal latency

---

### 6.4 Client-Side Consumption

The React frontend establishes a WebSocket connection:

```javascript
useEffect(() => {
  const ws = new WebSocket("ws://localhost:8000/ws/notifications");

  ws.onmessage = event => {
    setMessages(prev => [...prev, event.data]);
  };

  return () => ws.close();
}, []);
```

This enables:
- Immediate UI updates
- Simple client-side logic
- Efficient resource usage

---

## 7. Scalability Considerations

This design scales because:

- API Gateway instances are **stateless**
- Redis acts as a **shared event backbone**
- WebSocket connections are distributed across instances
- No direct coupling exists between producers and consumers

### Horizontal Scaling
- Add more API Gateway instances
- Add more backend services
- Redis ensures event propagation

### Fault Tolerance
- If one instance fails, others continue to receive events
- Clients reconnect automatically via WebSocket logic

---

## 8. How to Run the Example

### Prerequisites
- Docker
- Docker Compose

### Steps
```bash
docker-compose up --build
```

Then:
- Open the web application
- Create new content
- Observe real-time notifications across clients

---

## 9. Benefits and Limitations

### Benefits
- Simple and efficient
- Horizontally scalable
- Technology-agnostic pattern
- Suitable for real-time systems

### Limitations
- Redis Pub/Sub does not persist messages
- Not suitable for guaranteed delivery
- For durable events, Kafka or streams would be preferred

---

## 10. Conclusion

This tutorial demonstrated how to implement **scalable server-side notifications** using Redis Pub/Sub and WebSockets in a microservices architecture.

By decoupling event producers from consumers and leveraging a distributed in-memory cache, the system achieves:
- Low latency
- Horizontal scalability
- Clean architectural separation

This pattern is widely applicable to modern cloud-native systems requiring real-time communication.