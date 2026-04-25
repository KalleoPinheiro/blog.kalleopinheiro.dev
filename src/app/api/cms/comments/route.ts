import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { CreateCommentSchema } from "@/cms/schemas/comment";
import { normalizeData } from "@/cms/utils/normalize";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET /api/cms/comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateCommentSchema.parse(body);
    const comment = await prisma.comment.create({
      data: normalizeData(validated as Record<string, unknown>),
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("POST /api/cms/comments error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
