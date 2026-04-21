import swaggerJsdoc from "swagger-jsdoc";
import { env } from "@/utils/env";

export function getApiDocs() {
  return swaggerJsdoc({
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Personal Blog API",
        version: env.APP_VERSION,
        description: "Internal API for the personal blog.",
      },
    },
    apis: ["./src/app/api/**/*.ts"],
  });
}
