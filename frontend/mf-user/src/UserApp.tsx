import React, { useState } from "react";

export default function UserApp() {
  const [data, setData] = useState("");
  const [createdUser, setCreatedUser] = useState<{ id: string; name: string } | null>(null);
  const [token, setToken] = useState("");

  const load = async () => {
    const res = await fetch("http://localhost:8000/secure-data", {
      headers: {
        ...(token !== "" ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.status.toString() == "401") {
      setData("Unauthorized");
      return;
    }

    if (res.status.toString() == "403") {
      setData("Forbidden");
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
    const json = await res.json();
    setCreatedUser(json);
  }

  return (
    <>
      <div>
        <h2>User</h2>
        <input placeholder="Token: demo-token" onChange={e => setToken(e.target.value)} />
        <button onClick={load}>Load Secure Data</button>
        <p>{data}</p>
      </div>
      <div>
        <button onClick={create}>Create User</button>
        {createdUser && (
          <div>
            <h3>Created User:</h3>
            <p>ID: {createdUser.id}</p>
            <p>Name: {createdUser.name}</p>
          </div>
        )}
      </div>
    </>
  );
}