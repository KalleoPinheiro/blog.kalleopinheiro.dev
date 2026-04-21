import { notFound } from "next/navigation";
import { env } from "@/utils/env";
import { getApiDocs } from "@/utils/swagger";
import SwaggerPage from "./swagger-page";

export default function ApiDocsPage() {
  if (env.ENABLE_API_DOCS !== "true") {
    notFound();
  }

  const spec = getApiDocs() as Record<string, unknown>;

  return (
    <main className="min-h-screen">
      <SwaggerPage spec={spec} />
    </main>
  );
}
