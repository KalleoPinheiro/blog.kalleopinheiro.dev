import { NextResponse } from "next/server";
import { env } from "@/utils/env";

interface HealthPayload {
  status: "ok";
  uptime: number;
  version: string;
  timestamp: string;
}

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Healthcheck
 *     description: Returns liveness data for uptime monitoring
 *     operationId: getHealth
 *     tags:
 *       - Operations
 *     responses:
 *       '200':
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *                 - uptime
 *                 - version
 *                 - timestamp
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - ok
 *                 uptime:
 *                   type: number
 *                   description: Process uptime in seconds
 *                 version:
 *                   type: string
 *                   description: Application version
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Current timestamp in ISO 8601 format
 */
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
