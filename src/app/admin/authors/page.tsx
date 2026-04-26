import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Authors</h1>
        <a
          href="/admin/authors/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
        >
          New Author
        </a>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Bio</th>
              <th className="text-left px-4 py-3 font-medium">Posts</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {authors.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No authors yet
                </td>
              </tr>
            ) : (
              authors.map((author) => (
                <tr key={author.id} className="bg-card hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{author.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {author.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {author.bio || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {author._count.posts}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {author.createdAt.toLocaleDateString("pt-BR")}
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
