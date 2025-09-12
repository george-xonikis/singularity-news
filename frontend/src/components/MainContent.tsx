import Link from 'next/link';
import { Article } from '@singularity-news/shared';

interface MainContentProps {
  articles: Article[];
}

export default function MainContent({ articles }: MainContentProps) {
  return (
    <section className="lg:col-span-2">
      <h2 className="text-2xl text-black font-bold mb-4">Τελευταία Άρθρα</h2>
      <div className="space-y-6">
        {articles.map(article => {
          return (
            <article key={article.id} className="border-b border-gray-200 pb-6">
              <Link href={`/articles/${article.slug}`}>
                <h3 className="text-xl font-semibold text-black mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                  {article.title}
                </h3>
              </Link>
              <p className="text-black mb-2">
                {article.summary || article.content.substring(0, 150)}
              </p>
              <div className="flex justify-between items-center text-sm text-black">
                <div className="flex flex-wrap gap-1">
                  {article.topics.map((topic) => (
                    <span key={topic.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {topic.name}
                    </span>
                  ))}
                </div>
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
