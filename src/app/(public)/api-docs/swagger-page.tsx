"use client";

import SwaggerUIWidget from "@/components/ui/swagger-ui-widget";

type Props = {
  spec: Record<string, unknown>;
};

export default function SwaggerPage({ spec }: Props) {
  return <SwaggerUIWidget spec={spec} />;
}
