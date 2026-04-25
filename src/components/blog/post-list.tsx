import { PostCard } from "./post-card";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  author: {
    name: string;
  };
}

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (!posts.length) {
    return (
      <p className="text-center text-muted-foreground">
        No published posts yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
