import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer>
      <span>
        &copy; {new Date().getFullYear()} {siteConfig.name}
      </span>
    </footer>
  );
}
