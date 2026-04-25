import { prisma } from "@/lib/db";
import { buildPageMetadata } from "@/utils/metadata";
import { PostList } from "@/components/blog/post-list";
import { Suspense } from "react";

export const metadata = buildPageMetadata({
  title: "Blog",
  description: "Latest articles and updates",
  path: "/blog",
});

async function BlogContent() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      author: {
        select: { name: true },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return <PostList posts={posts} />;
}

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Articles and thoughts
        </p>
      </div>
      <Suspense fallback={<div>Loading posts...</div>}>
        <BlogContent />
      </Suspense>
    </div>
  );
}
