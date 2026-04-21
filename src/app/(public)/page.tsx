import { siteConfig } from "@/lib/site-config";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
      <p className="text-lg text-muted-foreground">{siteConfig.description}</p>
      <p className="text-sm text-muted-foreground">Em breve.</p>
    </main>
  );
}
