import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Read technical articles and insights",
};

async function ArticlesPage() {
  // TODO: Implement server-side data fetching
  // For now, this is a placeholder that will be populated with articles

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Articles
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Explore technical insights and learnings from software engineering
        </p>

        <div className="space-y-8">
          {/* Article list will be populated here */}
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Articles coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlesPage;
