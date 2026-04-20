import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { listTags, createTag, getPopularTags } from "@/services/tag.service";
import { tagCreateSchema } from "@/lib/validation/schemas";

/**
 * @swagger
 * /api/tags:
 *   get:
 *     tags:
 *       - Tags
 *     summary: List all tags
 *     parameters:
 *       - name: popular
 *         in: query
 *         schema:
 *           type: boolean
 *           default: false
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *   post:
 *     tags:
 *       - Tags
 *     summary: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 */

export async function GET(request: NextRequest) {
  try {
    const popular = request.nextUrl.searchParams.get("popular") === "true";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const tags = popular ? await getPopularTags(limit) : await listTags();
    return apiSuccess(tags);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = tagCreateSchema.parse(body);

    const tag = await createTag(validated);
    return apiSuccess(tag, "Tag created successfully", 201);
  } catch (error) {
    return apiError(error);
  }
}
