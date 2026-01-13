import React, { useEffect, useState } from "react";

export default function IoTApp() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/notifications");

    ws.onmessage = e => {
      setMessages(prev => [...prev, e.data]);
    };

    return () => ws.close();
  }, []);

  const analytics = async () => {
    await fetch("http://localhost:8000/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temperature: 23.5 })
    });
  };

  return (
    <div>
      <h2>IoT / Notifications</h2>
      <ul>
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>

      <button onClick={analytics}>Send Telemetry</button>
    </div>
  );
}