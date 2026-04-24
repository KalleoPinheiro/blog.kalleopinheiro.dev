import { siteConfig } from "@/utils/site-config";

export function GET(): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.feed.title}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.feed.description}</description>
    <language>${siteConfig.feed.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
