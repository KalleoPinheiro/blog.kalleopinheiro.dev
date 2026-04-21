import { env } from "@/utils/env";
import { getApiDocs } from "@/utils/swagger";

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: OpenAPI specification
 *     description: Returns the OpenAPI 3.1.0 specification for the API
 *     operationId: getApiDocs
 *     tags:
 *       - Documentation
 *     responses:
 *       '200':
 *         description: OpenAPI spec in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: API docs not available in this environment
 */
export function GET(): Response {
  if (env.ENABLE_API_DOCS !== "true") {
    return new Response(null, { status: 404 });
  }

  return Response.json(getApiDocs());
}
