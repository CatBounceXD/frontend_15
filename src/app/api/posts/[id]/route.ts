import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await db.delete(posts).where(eq(posts.id, Number(id)));

  return NextResponse.json({ message: "Deleted" }, { status: 204 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const { title, content } = body;

  // Validasi sederhana
  if (!title || !content) {
    return NextResponse.json(
      { error: "Title dan content wajib diisi" },
      { status: 400 },
    );
  }

  const updated = await db
    .update(posts)
    .set({ title, content })
    .where(eq(posts.id, Number(id)))
    .returning()
    .get();

  if (!updated) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}