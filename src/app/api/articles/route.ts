import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { listArticles, createArticle } from "@/services/article.service";
import { articleCreateSchema, paginationSchema } from "@/lib/validation/schemas";
import { ValidationError } from "@/lib/utils/errors";

/**
 * @swagger
 * /api/articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: List all articles
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Article'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *   post:
 *     tags:
 *       - Articles
 *     summary: Create a new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               summary:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               categoryId:
 *                 type: string
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const status = request.nextUrl.searchParams.get(
      "status"
    ) as "DRAFT" | "PUBLISHED" | "ARCHIVED" | null;

    const pagination = paginationSchema.parse({ page, limit });
    const result = await listArticles({ ...pagination, status: status || undefined });

    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = articleCreateSchema.parse(body);

    // TODO: Get actual user ID from session
    const authorId = "default-user";

    const article = await createArticle({
      ...validated,
      authorId,
    });

    return apiSuccess(article, "Article created successfully", 201);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return apiError(
        new ValidationError(error.message),
        400
      );
    }
    return apiError(error);
  }
}
