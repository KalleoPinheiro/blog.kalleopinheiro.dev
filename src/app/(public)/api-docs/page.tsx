import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { env } from "@/utils/env";
import { getApiDocs } from "@/utils/swagger";

const SwaggerUIWidget = dynamic(
  () => import("@/components/ui/swagger-ui-widget"),
  { ssr: false },
);

export default function ApiDocsPage() {
  if (env.ENABLE_API_DOCS !== "true") {
    notFound();
  }

  const spec = getApiDocs();

  return (
    <main className="min-h-screen">
      <SwaggerUIWidget spec={spec} />
    </main>
  );
}
