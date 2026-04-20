import prisma from "@/lib/db/client";
import {
  Article,
  ArticleStatus,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/types";
import {
  ArticleCreate,
  ArticleUpdate,
} from "@/lib/validation/schemas";
import {
  calculateReadingTime,
  slugify,
  generateExcerpt,
} from "@/lib/utils/string";
import { NotFoundError, ConflictError } from "@/lib/utils/errors";

export async function createArticle(
  data: ArticleCreate & { authorId: string }
): Promise<Article> {
  const slug = slugify(data.slug || data.title);

  const existing = await prisma.article.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new ConflictError(
      `Article with slug "${slug}" already exists`
    );
  }

  const readingTime = calculateReadingTime(data.content);

  const article = await prisma.article.create({
    data: {
      slug,
      title: data.title,
      summary: data.summary || generateExcerpt(data.content),
      content: data.content,
      status: data.status || "DRAFT",
      readingTimeMinutes: readingTime,
      authorId: data.authorId,
      categoryId: data.categoryId,
      articleTags: data.tagIds?.length
        ? {
            create: data.tagIds.map((tagId) => ({
              tagId,
            })),
          }
        : undefined,
    },
    include: {
      author: true,
      category: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return mapArticleToType(article);
}

export async function updateArticle(
  id: string,
  data: ArticleUpdate
): Promise<Article> {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError(`Article with ID "${id}" not found`);
  }

  const updateData: {
    title?: string;
    summary?: string;
    content?: string;
    status?: ArticleStatus;
    categoryId?: string | null;
    readingTimeMinutes?: number;
  } = {};

  if (data.title) {
    updateData.title = data.title;
  }

  if (data.summary) {
    updateData.summary = data.summary;
  }

  if (data.content) {
    updateData.content = data.content;
    updateData.readingTimeMinutes = calculateReadingTime(data.content);
  }

  if (data.status) {
    updateData.status = data.status;
  }

  if (data.categoryId !== undefined) {
    updateData.categoryId = data.categoryId;
  }

  const updated = await prisma.article.update({
    where: { id },
    data: updateData,
    include: {
      author: true,
      category: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return mapArticleToType(updated);
}

export async function getArticle(id: string): Promise<Article> {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!article) {
    throw new NotFoundError(`Article with ID "${id}" not found`);
  }

  // Increment view count
  await prisma.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return mapArticleToType(article);
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!article) {
    throw new NotFoundError(`Article with slug "${slug}" not found`);
  }

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  return mapArticleToType(article);
}

export async function listArticles(
  params: PaginationParams & { status?: ArticleStatus }
): Promise<PaginatedResponse<Article>> {
  const { page, limit, status } = params;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: true,
        category: true,
        articleTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles.map(mapArticleToType),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function publishArticle(
  id: string,
  publishedAt?: Date
): Promise<Article> {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError(`Article with ID "${id}" not found`);
  }

  const updated = await prisma.article.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: publishedAt || new Date(),
    },
    include: {
      author: true,
      category: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return mapArticleToType(updated);
}

export async function archiveArticle(id: string): Promise<Article> {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError(`Article with ID "${id}" not found`);
  }

  const updated = await prisma.article.update({
    where: { id },
    data: { status: "ARCHIVED" },
    include: {
      author: true,
      category: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return mapArticleToType(updated);
}

export async function deleteArticle(id: string): Promise<void> {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError(`Article with ID "${id}" not found`);
  }

  await prisma.article.delete({
    where: { id },
  });
}

function mapArticleToType(data: any): Article {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    content: data.content,
    htmlContent: data.htmlContent,
    status: data.status,
    readingTimeMinutes: data.readingTimeMinutes,
    viewCount: data.viewCount,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    authorId: data.authorId,
    author: data.author,
    categoryId: data.categoryId,
    category: data.category,
    tags: data.articleTags?.map((at: any) => at.tag),
    comments: data.comments,
  };
}
