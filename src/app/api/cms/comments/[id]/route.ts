import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { UpdateCommentSchema } from "@/cms/schemas/comment";
import { normalizeData } from "@/cms/utils/normalize";
import { prisma } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json(comment);
  } catch (error) {
    console.error("GET /api/cms/comments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateCommentSchema.parse(body);
    const comment = await prisma.comment.update({
      where: { id },
      data: normalizeData(validated),
    });
    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("PUT /api/cms/comments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
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
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/cms/comments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
