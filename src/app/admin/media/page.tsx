import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Media</h1>
        <a
          href="/admin/media/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
        >
          Upload Media
        </a>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Filename</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Size</th>
              <th className="text-left px-4 py-3 font-medium">URL</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {media.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No media yet
                </td>
              </tr>
            ) : (
              media.map((item) => (
                <tr key={item.id} className="bg-card hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.filename}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {item.mimeType}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatBytes(item.size)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-foreground"
                    >
                      {item.url}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
