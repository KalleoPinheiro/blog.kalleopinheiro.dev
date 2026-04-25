import Link from "next/link";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date | null;
    author: {
      name: string;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("pt-BR")
    : "Draft";

  return (
    <article className="space-y-2 border-b pb-6">
      <div className="flex flex-col gap-2">
        <Link
          href={`/posts/${post.slug}`}
          className="text-2xl font-bold hover:text-primary transition-colors"
        >
          {post.title}
        </Link>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{post.author.name}</span>
          <span>•</span>
          <time dateTime={post.publishedAt?.toISOString() ?? ""}>
            {publishDate}
          </time>
        </div>
      </div>
      <p className="text-muted-foreground">{post.excerpt}</p>
      <Link
        href={`/posts/${post.slug}`}
        className="inline-block text-primary hover:underline text-sm font-medium"
      >
        Read more →
      </Link>
    </article>
  );
}
