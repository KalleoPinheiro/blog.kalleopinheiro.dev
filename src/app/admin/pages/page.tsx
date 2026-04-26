import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pages</h1>
        <a
          href="/admin/pages/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
        >
          New Page
        </a>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pages.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No pages yet
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="bg-card hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {page.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${page.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {page.createdAt.toLocaleDateString("pt-BR")}
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
