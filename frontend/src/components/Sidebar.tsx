import Link from 'next/link';
import { Article, Topic } from '@singularity-news/shared';

interface SidebarProps {
  articles: Article[];
  topics: Topic[];
}

export default function Sidebar({ articles, topics }: SidebarProps) {
  // Sort articles deterministically to avoid hydration mismatch
  // const popularArticles = [...articles]
  //   .sort((a, b) => b.views - a.views)
  //   .slice(0, 3);

  return (
    <aside className="lg:col-span-1">
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={article.id} className="text-sm">
              <span className="font-bold text-lg text-gray-400 mr-2">{index + 1}.</span>
              <Link href={`/articles/${article.slug}`} className="hover:text-blue-600">
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Topics</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map(topic => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="bg-white px-3 py-1 rounded-full text-sm border hover:bg-gray-100 cursor-pointer inline-block"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}