"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);

        if (res.status === 404) {
          router.push("/not-found");
          return;
        }

        if (!res.ok) {
          console.error("GET post failed:", res.status, await res.text());
          return;
        }

        const data = await res.json();
        if (!cancelled) setPost(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.push("/");
  };

  const handleEdit = async () => {
    await fetch(`/api/posts/${id}/edit`);
    router.push(`/post/${id}/edit`);
  };

  if (!post) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      <h1>{(post as { title: string }).title}</h1>
      <p className="text-muted">
        {new Date((post as { createdAt: string }).createdAt).toLocaleDateString(
          "id-ID",
        )}
      </p>
      <p>{(post as { content: string }).content}</p>
      <button type="button" onClick={handleDelete} className="btn btn-danger">
        Delete
      </button>
      <button type="button" onClick={handleEdit} className="btn btn-primary">
        Edit
      </button>
    </main>
  );
}
