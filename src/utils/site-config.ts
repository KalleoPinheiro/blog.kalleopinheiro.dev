import { env } from "@/utils/env";

export interface SiteConfig {
  name: string;
  url: string;
  defaultLocale: string;
  description: string;
  feed: {
    title: string;
    description: string;
    language: string;
  };
  social: {
    twitter?: string;
    github?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Kalleo Pinheiro",
  url: env.NEXT_PUBLIC_SITE_URL,
  defaultLocale: "pt-BR",
  description: "Artigos técnicos sobre desenvolvimento de software.",
  feed: {
    title: "Kalleo Pinheiro — Blog",
    description: "Artigos técnicos sobre desenvolvimento de software.",
    language: "pt-BR",
  },
  social: {
    github: "kalleopinheiro",
  },
};
