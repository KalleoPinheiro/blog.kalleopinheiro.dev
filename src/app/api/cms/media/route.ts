import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { CreateMediaSchema } from "@/cms/schemas/media";
import { normalizeData } from "@/cms/utils/normalize";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("GET /api/cms/media error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateMediaSchema.parse(body);
    const item = await prisma.media.create({
      data: normalizeData(validated as Record<string, unknown>),
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("POST /api/cms/media error:", error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 },
    );
  }
}
