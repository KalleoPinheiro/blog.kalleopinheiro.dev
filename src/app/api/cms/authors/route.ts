import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { CreateAuthorSchema, UpdateAuthorSchema } from "@/cms/schemas/author";
import { normalizeData } from "@/cms/utils/normalize";

export async function GET(req: NextRequest) {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(authors);
  } catch (error) {
    console.error("GET /api/cms/authors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateAuthorSchema.parse(body);
    const author = await prisma.author.create({
      data: normalizeData(validated as Record<string, unknown>),
    });
    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("POST /api/cms/authors error:", error);
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}
