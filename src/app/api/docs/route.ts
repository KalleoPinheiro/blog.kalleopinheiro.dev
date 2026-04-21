import { env } from "@/utils/env";

function buildOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Personal Blog API",
      version: env.APP_VERSION,
      description: "Internal API for the personal blog.",
    },
    paths: {
      "/api/health": {
        get: {
          summary: "Healthcheck",
          description: "Returns liveness data for uptime monitoring.",
          operationId: "getHealth",
          tags: ["Operations"],
          responses: {
            "200": {
              description: "Service is alive",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["status", "uptime", "version", "timestamp"],
                    properties: {
                      status: { type: "string", enum: ["ok"] },
                      uptime: { type: "number" },
                      version: { type: "string" },
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

function buildSwaggerHtml(): string {
  const spec = JSON.stringify(buildOpenApiSpec());
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      spec: ${spec},
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
    });
  </script>
</body>
</html>`;
}

export function GET(): Response {
  if (env.ENABLE_API_DOCS !== "true") {
    return new Response(null, { status: 404 });
  }

  return new Response(buildSwaggerHtml(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
