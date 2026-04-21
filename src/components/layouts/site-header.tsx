import { siteConfig } from "@/utils/site-config";

export function SiteHeader() {
  return (
    <header>
      <span>{siteConfig.name}</span>
    </header>
  );
}
