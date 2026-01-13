import React, { useState } from "react";
import "./styles.css";

export default function UserApp() {
  const [data, setData] = useState("");
  const [createdUser, setCreatedUser] = useState<any>(null);
  const [token, setToken] = useState("");

  const load = async () => {
    const res = await fetch("http://localhost:8000/secure-data", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      setData(res.status === 401 ? "Unauthorized" : "Forbidden");
      return;
    }

    const json = await res.json();
    setData(json.message);
  };

  const create = async () => {
    const res = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "1", name: "Alice" })
    });
    setCreatedUser(await res.json());
  };

  return (
    <div className="card">
      <h2>👤 User Service</h2>

      <input
        placeholder="Token: demo-token"
        onChange={e => setToken(e.target.value)}
      />
      <button onClick={load}>Load Secure Data</button>

      <p>{data}</p>

      <hr />

      <button onClick={create}>Create User</button>

      {createdUser && (
        <div>
          <h3>Created User</h3>
          <p>ID: {createdUser.id}</p>
          <p>Name: {createdUser.name}</p>
        </div>
      )}
    </div>
  );
}