import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { UpdateMediaSchema } from "@/cms/schemas/media";
import { normalizeData } from "@/cms/utils/normalize";
import { prisma } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const item = await prisma.media.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("GET /api/cms/media/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateMediaSchema.parse(body);
    const item = await prisma.media.update({
      where: { id },
      data: normalizeData(validated),
    });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("PUT /api/cms/media/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update media" },
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
    await prisma.media.delete({ where: { id } });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/cms/media/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 },
    );
  }
}
