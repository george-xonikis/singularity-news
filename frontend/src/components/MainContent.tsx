import Link from 'next/link';
import Image from 'next/image';
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
              {/* Mobile layout with thumbnail */}
              <div className="md:hidden">
                <Link href={`/articles/${article.slug}`} className="block">
                  {article.coverPhoto && (
                    <div className="mb-3">
                      <Image
                        src={article.coverPhoto}
                        alt={article.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-black mb-2 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {article.summary || article.content.substring(0, 150)}
                  </p>
                </Link>
                <div className="flex justify-between items-center text-sm text-black mt-3">
                  <div className="flex flex-wrap gap-1">
                    {article.topics.map((topic) => (
                      <span key={topic.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {topic.name}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs">{article.views.toLocaleString()} αναγνώσεις</span>
                </div>
              </div>

              {/* Desktop layout without thumbnail */}
              <div className="hidden md:block">
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
                  <span>{article.views.toLocaleString()} αναγνώσεις</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
