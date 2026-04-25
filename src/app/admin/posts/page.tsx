export default function PostsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <a href="/admin/posts/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          New Post
        </a>
      </div>
      <div className="bg-white rounded shadow p-6">
        <p className="text-gray-500">No posts yet</p>
      </div>
    </div>
  );
}
