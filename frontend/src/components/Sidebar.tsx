import { Article, Topic } from '@/api/dataLayer';

interface SidebarProps {
  articles: Article[];
  topics: Topic[];
}

export default function Sidebar({ articles, topics }: SidebarProps) {
  return (
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
  );
}