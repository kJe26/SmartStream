import React, { useEffect, useState } from "react";
import "./styles.css";

export default function ContentApp() {
  const [contents, setContents] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/contents")
      .then(res => res.json())
      .then(setContents);
  }, []);

  const submit = async () => {
    if (!title) return;
    await fetch("http://localhost:8000/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setContents(prev => [...prev, { title }]);
    setTitle("");
  };

  return (
    <div className="card">
      <h2>📦 Content Service</h2>

      <div>
        <input
          value={title}
          placeholder="Content title"
          onChange={e => setTitle(e.target.value)}
        />
        <button onClick={submit}>Publish</button>
      </div>

      <ul className="list">
        {contents.map((c, i) => (
          <li key={i}>
            <span className="badge">Content</span> {c.title}
          </li>
        ))}
      </ul>
    </div>
  );
}