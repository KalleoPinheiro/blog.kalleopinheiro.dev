import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  getArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
} from "@/services/article.service";
import { articleUpdateSchema } from "@/lib/validation/schemas";

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get a single article by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *   patch:
 *     tags:
 *       - Articles
 *     summary: Update an article
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 *   delete:
 *     tags:
 *       - Articles
 *     summary: Delete an article
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 */

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const article = await getArticle(id);
    return apiSuccess(article);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = articleUpdateSchema.partial().parse(body);

    const article = await updateArticle(id, validated);
    return apiSuccess(article, "Article updated successfully");
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteArticle(id);
    return apiSuccess(null, "Article deleted successfully", 204);
  } catch (error) {
    return apiError(error);
  }
}

/**
 * @swagger
 * /api/articles/{id}/publish:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Publish an article
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 */
export async function POST(request: NextRequest, { params }: Params) {
  const pathname = request.nextUrl.pathname;

  if (pathname.includes("/publish")) {
    try {
      const { id } = await params;
      const article = await publishArticle(id);
      return apiSuccess(article, "Article published successfully");
    } catch (error) {
      return apiError(error);
    }
  }

  return apiError(new Error("Unknown action"), 404);
}
