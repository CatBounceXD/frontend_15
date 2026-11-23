import { desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";

export default async function Home() {
  const post = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <main className="container mt-4">
      <h1>Blog Posts</h1>
      <Link href="/create" className="btn btn-primary mb-3">
        Create Post
      </Link>
      {post.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="list-group">
          {post.map((post: unknown) => (
            <li key={(post as { id: string }).id} className="list-group-item">
              <Link href={`/post/${(post as { id: string }).id}`}>
                {(post as { title: string }).title}
              </Link>
              <span className="text-muted float-end">
                {new Date(
                  (post as { createdAt: string }).createdAt,
                ).toLocaleDateString("id-ID")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
