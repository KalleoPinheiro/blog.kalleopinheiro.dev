export default function PagesAdminPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pages</h1>
        <a href="/admin/pages/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          New Page
        </a>
      </div>
      <div className="bg-white rounded shadow p-6">
        <p className="text-gray-500">No pages yet</p>
      </div>
    </div>
  );
}
