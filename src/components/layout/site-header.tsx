import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header>
      <span>{siteConfig.name}</span>
    </header>
  );
}
