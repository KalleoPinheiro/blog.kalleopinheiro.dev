export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow">
        <nav className="p-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/admin/posts" className="block px-4 py-2 rounded hover:bg-gray-100">
            Posts
          </a>
          <a href="/admin/pages" className="block px-4 py-2 rounded hover:bg-gray-100">
            Pages
          </a>
          <a href="/admin/authors" className="block px-4 py-2 rounded hover:bg-gray-100">
            Authors
          </a>
          <a href="/admin/media" className="block px-4 py-2 rounded hover:bg-gray-100">
            Media
          </a>
          <a href="/admin/comments" className="block px-4 py-2 rounded hover:bg-gray-100">
            Comments
          </a>
        </nav>
      </div>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
