import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { UpdatePageSchema } from "@/cms/schemas/page";
import { normalizeData } from "@/cms/utils/normalize";
import { prisma } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (error) {
    console.error("GET /api/cms/pages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdatePageSchema.parse(body);
    const page = await prisma.page.update({
      where: { id },
      data: normalizeData(validated as Record<string, unknown>),
    });
    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("PUT /api/cms/pages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    await prisma.page.delete({ where: { id } });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/cms/pages/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 },
    );
  }
}
