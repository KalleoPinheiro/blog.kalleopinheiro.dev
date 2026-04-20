import { NextResponse } from "next/server";
import { swaggerSpec } from "@/lib/swagger/config";

/**
 * @swagger
 * /api/docs:
 *   get:
 *     tags:
 *       - Health
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI/Swagger specification for the API
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
  if (process.env.SWAGGER_ENABLED !== "true") {
    return NextResponse.json({ error: "API docs are disabled" }, { status: 403 });
  }

  return NextResponse.json(swaggerSpec);
}
