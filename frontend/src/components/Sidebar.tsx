import Link from 'next/link';
import { Article, Topic } from '@singularity-news/shared';

interface SidebarProps {
  articles: Article[];
  topics: Topic[];
}

export default function Sidebar({ articles, topics }: SidebarProps) {
  return (
    <aside className="lg:col-span-1">
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg text-black font-semibold mb-4">Δημοφιλή Άρθρα</h3>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={article.id} className="text-sm">
              <span className="font-bold text-gray-600 text-lg mr-2">{index + 1}.</span>
              <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 text-black">
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="text-lg text-black font-semibold mb-4">Κατηγορίες</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map(topic => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="bg-white px-3 py-1 text-black rounded-full text-sm border hover:bg-gray-100 cursor-pointer inline-block"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}