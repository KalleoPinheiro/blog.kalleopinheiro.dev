export default function AuthorsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Authors</h1>
        <a href="/admin/authors/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          New Author
        </a>
      </div>
      <div className="bg-white rounded shadow p-6">
        <p className="text-gray-500">No authors yet</p>
      </div>
    </div>
  );
}
