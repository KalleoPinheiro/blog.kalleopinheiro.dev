import { NextResponse } from "next/server";
import { env } from "@/lib/env";

interface HealthPayload {
  status: "ok";
  uptime: number;
  version: string;
  timestamp: string;
}

export function GET(): NextResponse<HealthPayload> {
  return NextResponse.json(
    {
      status: "ok",
      uptime: process.uptime(),
      version: env.APP_VERSION,
      timestamp: new Date().toISOString(),
    },
    {
      headers: { "cache-control": "no-store" },
    },
  );
}
