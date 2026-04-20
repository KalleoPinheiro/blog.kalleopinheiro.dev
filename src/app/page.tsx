import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Personal Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
          A knowledge hub for technical insights, systems architecture, and
          software engineering practices.
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">
          Documenting the journey of learning, building, and evolving as an
          engineer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/articles"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Read Articles
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            About
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Latest Articles
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Articles coming soon...
          </p>
        </div>
      </section>
    </div>
  );
}
