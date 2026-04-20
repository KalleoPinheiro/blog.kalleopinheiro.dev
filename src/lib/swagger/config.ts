import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Blog API",
      version: "1.0.0",
      description: "API documentation for the Personal Blog application",
      contact: {
        name: "API Support",
        email: "support@blog.local",
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "sessionId",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            username: { type: "string" },
            displayName: { type: "string" },
            bio: { type: "string" },
            avatarUrl: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "email", "username", "displayName"],
        },
        Article: {
          type: "object",
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: "string" },
            status: { type: "string", enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
            readingTimeMinutes: { type: "integer" },
            viewCount: { type: "integer" },
            publishedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            authorId: { type: "string" },
            categoryId: { type: "string" },
          },
          required: ["id", "slug", "title", "content", "authorId"],
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "slug"],
        },
        Tag: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "slug"],
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "string" },
            content: { type: "string" },
            status: {
              type: "string",
              enum: ["PENDING", "APPROVED", "REJECTED"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            articleId: { type: "string" },
            authorId: { type: "string" },
            authorName: { type: "string" },
            parentCommentId: { type: "string" },
          },
          required: ["id", "content", "articleId"],
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", default: false },
            error: { type: "string" },
            message: { type: "string" },
            statusCode: { type: "integer" },
          },
          required: ["success", "error", "message", "statusCode"],
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Articles",
        description: "Article management endpoints",
      },
      {
        name: "Categories",
        description: "Category management endpoints",
      },
      {
        name: "Tags",
        description: "Tag management endpoints",
      },
      {
        name: "Comments",
        description: "Comment management endpoints",
      },
      {
        name: "Search",
        description: "Search functionality endpoints",
      },
    ],
  },
  apis: ["./src/app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
