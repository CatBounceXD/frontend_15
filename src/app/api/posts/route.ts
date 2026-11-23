import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";

export async function GET() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return NextResponse.json(allPosts);
}

export async function POST(req: Request) {
  const { title, content } = await req.json();

  // Validate the input
  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 },
    );
  }

  const newPost = await db.insert(posts).values({ title, content }).returning();
  revalidatePath("/");
  revalidatePath(`/post/${newPost[0].id}`); 
  return NextResponse.json(newPost[0], { status: 201 });
}
