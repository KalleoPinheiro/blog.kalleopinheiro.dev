import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { UpdatePostSchema } from "@/cms/schemas/post";
import { normalizeData } from "@/cms/utils/normalize";
import { prisma } from "@/lib/db";

function isP2025(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/cms/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdatePostSchema.parse(body);

    const post = await prisma.post.update({
      where: { id },
      data: normalizeData(validated),
      include: { author: true },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }
    if (isP2025(error)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    console.error("PUT /api/cms/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;

    await prisma.post.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isP2025(error)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    console.error("DELETE /api/cms/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
