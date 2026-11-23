"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title,
          content: data.content,
        });
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push(`/post/${id}`);
      router.refresh();
    } else {
      alert("failed to update post");
    }
  };

  return (
    <main className="container mt-4">
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="edit-judul" className="form-label">
            Title
          </label>
          <input
            className="form-control"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="edit-content" className="form-label">
            Content
          </label>
          <textarea
            className="form-control"
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Save
        </button>
      </form>
    </main>
  );
}
