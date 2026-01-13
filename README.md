# Distributed Microservices System with Event-Driven Architecture

## Overview
This project implements a **distributed software system** based on **microservices**, **event-driven communication**, and **scalable web technologies**.  
The system exposes **secured REST APIs**, supports **real-time notifications**, processes **IoT telemetry**, and uses **message brokers and event streaming** to decouple services.

The backend is implemented using **Python (FastAPI)**, while the frontend uses **React with a micro-frontend architecture**.  
All components are containerized and orchestrated using **Docker Compose**.

This project fulfills the requirements for:
- Secured REST services
- Microservices architecture (>2 services)
- Scalability and asynchronous communication
- WebSockets and server-side notifications
- Containers and documentation (UML + C4 models)

---

## Technologies Used

### Backend
- Python 3
- FastAPI
- Strawberry GraphQL
- HTTPX
- Redis (Pub/Sub)
- RabbitMQ
- NATS
- MQTT (Mosquitto)
- aio-pika / pika
- asyncio

### Frontend
- React
- Micro-frontend architecture
- WebSockets
- Fetch API

### Infrastructure & Deployment
- Docker
- Docker Compose

---

## How to Run the Project

### Prerequisites
- Docker
- Docker Compose

### Steps
```bash
docker-compose up --build
```

### Access the application

API Gateway: http://localhost:8000

Web Application: http://localhost:3000 (if configured)

WebSocket endpoint: ws://localhost:8000/ws/notifications

---

## Project Structure and Meaning

### Backend
```
backend/
├── api-gateway/        # Entry point, secured REST, GraphQL, WebSockets
├── content-service/    # Content management and event publishing
├── iot-service/        # IoT telemetry ingestion (MQTT → NATS)
├── analytics-service/  # Event-driven analytics consumer
├── news-service/       # RabbitMQ consumer (background worker)
├── notification-fn/    # FaaS-style stateless function
├── shared/
│   └── auth/           # Authentication and authorization
├── mosquitto/          # MQTT broker configuration
├── docker-compose.yml
```

### Frontend
```
frontend/
├── shell/              # Host application
├── mf-content/         # Content micro-frontend
├── mf-iot/             # IoT and notifications micro-frontend
├── mf-user/            # User and secured data micro-frontend
├── docker-compose.yml
```

---

## Architecture Diagrams

### 1. C4 Context Diagram
**Purpose:** Shows the system boundary, users, and external systems.

![alt text](diagrams/C4%20Context%20Diagram.png)

---

### 2. C4 Container Diagram
**Purpose:** Shows deployable containers and communication paths.

![alt text](diagrams/C4%20Container%20Diagram.png)

---

### 3. UML Component Diagram
**Purpose:** Shows internal structure and responsibilities.

![alt text](diagrams/Uml%20component%20diagram.png)

---

### 4. UML Sequence Diagram
**Purpose:** Shows runtime behavior (IoT telemetry flow).

![alt text](diagrams/Uml%20sequence%20diagram.png)

---

## Additional Notes
- Multiple communication paradigms: REST, WebSockets, Pub/Sub, MQTT
- Horizontally scalable architecture
- API Gateway pattern
- Event-driven design
- Cloud-native principles

---

## Conclusion
This project demonstrates a scalable, distributed microservices architecture using modern backend, frontend, and infrastructure technologies.