import React, { useEffect, useState } from "react";

export default function ContentApp() {
  const [contents, setContents] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/contents")
      .then(res => res.json())
      .then(setContents);
  }, []);

  const submit = async () => {
    await fetch("http://localhost:8000/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  };

  return (
    <div>
      <h2>Content</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={submit}>Publish</button>

      <ul>
        {contents.map((c, i) => <li key={i}>{c.title}</li>)}
      </ul>
    </div>
  );
}