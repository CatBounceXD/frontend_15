import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";

function parseId(id: string): number | null {
  const numericId = Number(id);
  return Number.isNaN(numericId) ? null : numericId;
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseId(id);

  if (numericId === null) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.id, numericId))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseId(id);

  if (numericId === null) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const deleted = await db
    .delete(posts)
    .where(eq(posts.id, numericId))
    .returning();

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  revalidatePath("/"); 
  return new NextResponse(null, { status: 204 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseId(id);

  if (numericId === null) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await request.json();
  const { title, content } = body ?? {};

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title dan content wajib diisi" },
      { status: 400 },
    );
  }

  const updated = await db
    .update(posts)
    .set({ title, content })
    .where(eq(posts.id, numericId))
    .returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath(`/post/${numericId}`);
  return NextResponse.json(updated[0]);
}
