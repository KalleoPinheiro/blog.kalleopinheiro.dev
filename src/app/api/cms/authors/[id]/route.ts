import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { UpdateAuthorSchema } from "@/cms/schemas/author";
import { normalizeData } from "@/cms/utils/normalize";
import { prisma } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }
    return NextResponse.json(author);
  } catch (error) {
    console.error("GET /api/cms/authors/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateAuthorSchema.parse(body);
    const author = await prisma.author.update({
      where: { id },
      data: normalizeData(validated as Record<string, unknown>),
    });
    return NextResponse.json(author);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("PUT /api/cms/authors/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update author" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    await prisma.author.delete({ where: { id } });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/cms/authors/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete author" },
      { status: 500 },
    );
  }
}
