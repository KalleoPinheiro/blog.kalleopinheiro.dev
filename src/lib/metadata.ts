import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export interface PageMetadataInput {
  title: string;
  description?: string;
  path?: string;
}

export function buildRootMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    alternates: {
      canonical: siteConfig.url,
    },
    openGraph: {
      type: "website",
      url: siteConfig.url,
      siteName: siteConfig.name,
      description: siteConfig.description,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const canonical = input.path
    ? `${siteConfig.url}${input.path}`
    : siteConfig.url;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
  };
}
