import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [posts, pages, authors, comments] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.author.count(),
    prisma.comment.count(),
  ]);

  const stats = [
    { label: "Posts", value: posts },
    { label: "Pages", value: pages },
    { label: "Authors", value: authors },
    { label: "Comments", value: comments },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border p-6 rounded-lg"
          >
            <h3 className="text-muted-foreground text-sm">{stat.label}</h3>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
