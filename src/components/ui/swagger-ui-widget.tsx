"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type Props = {
  spec: Record<string, unknown>;
};

export default function SwaggerUIWidget({ spec }: Props) {
  return (
    <SwaggerUI
      spec={spec}
      defaultModelsExpandDepth={0}
      docExpansion="list"
      filter={true}
      showRequestHeaders={true}
      supportedSubmitMethods={["get", "post", "put", "delete", "patch"]}
    />
  );
}
