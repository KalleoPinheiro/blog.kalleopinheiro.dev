import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { CreatePageSchema } from "@/cms/schemas/page";
import { normalizeData } from "@/cms/utils/normalize";

export async function GET(req: NextRequest) {
  try {
    const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("GET /api/cms/pages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreatePageSchema.parse(body);
    const page = await prisma.page.create({
      data: normalizeData(validated as Record<string, unknown>),
    });
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("POST /api/cms/pages error:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
