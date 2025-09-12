import { Article } from '@singularity-news/shared';
import { ArticleSummary } from './ArticleSummary';

interface MainContentProps {
  articles: Article[];
}

export default function MainContent({ articles }: MainContentProps) {
  return (
    <section className="lg:col-span-2">
      <h2 className="text-2xl text-black font-bold mb-4">Τελευταία Άρθρα</h2>
      <div className="space-y-6">
        {articles.map(article => (
          <ArticleSummary
            key={article.id}
            article={article}
            variant="list"
          />
        ))}
      </div>
    </section>
  );
}
