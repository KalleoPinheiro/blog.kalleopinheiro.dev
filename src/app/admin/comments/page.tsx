import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function CommentsPage() {
  const comments = await prisma.comment.findMany({
    include: { post: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Comments</h1>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Author</th>
              <th className="text-left px-4 py-3 font-medium">Post</th>
              <th className="text-left px-4 py-3 font-medium">Content</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No comments yet
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <tr key={comment.id} className="bg-card hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{comment.author}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">
                    {comment.post.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {comment.content}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[comment.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {comment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {comment.createdAt.toLocaleDateString("pt-BR")}
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
