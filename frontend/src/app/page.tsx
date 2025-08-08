'use client';

import { useEffect } from 'react';
import { useArticleStore } from '@/store/articleStore';
import { useTopicStore } from '@/store/topicStore';

export default function Home() {
  const { articles, loading, error, fetchArticles } = useArticleStore();
  const { topics, fetchTopics } = useTopicStore();

  useEffect(() => {
    fetchArticles();
    fetchTopics();
  }, [fetchArticles, fetchTopics]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">AI NEWS</h1>
          <p className="text-center text-gray-600 mt-2">Modern AI-Powered News Website</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-8 text-sm font-medium uppercase">
            <li><a href="#" className="hover:underline">HOME</a></li>
            {topics.slice(0, 5).map(topic => (
              <li key={topic.id}>
                <a href="#" className="hover:underline">{topic.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Section */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="space-y-6">
              {articles.map(article => (
                <article key={article.id} className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{article.topic}</span>
                    <span>{article.views} views</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
              <ul className="space-y-3">
                {articles
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 3)
                  .map((article, index) => (
                    <li key={article.id} className="text-sm">
                      <span className="font-bold text-lg text-gray-400 mr-2">
                        {index + 1}.
                      </span>
                      <a href="#" className="hover:text-blue-600">
                        {article.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <span
                    key={topic.id}
                    className="bg-white px-3 py-1 rounded-full text-sm border hover:bg-gray-100 cursor-pointer"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 AI News. Modern newspaper design with Neutral perspective and Fact-based synthesis.</p>
        </div>
      </footer>
    </div>
  );
}
