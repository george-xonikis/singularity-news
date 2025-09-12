import { getArticles, getTopics } from '@/lib/server-data';
import MainContent from '@/components/MainContent';
import Sidebar from '@/components/Sidebar';

export default async function Home() {
  const [articles, topics] = await Promise.all([
    getArticles(),
    getTopics()
  ]);

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <MainContent articles={articles} />
        <Sidebar articles={articles} topics={topics} />
      </div>
    </main>
  );
}
