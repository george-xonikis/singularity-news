import { getArticles, getTopics } from '@/lib/server-data';
import MainContent from '@/components/MainContent';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DebugEnv from '@/components/DebugEnv';

export default async function Home() {
  const [articles, topics] = await Promise.all([
    getArticles(),
    getTopics()
  ]);

  return (
    <div className="min-h-screen bg-white">
      <DebugEnv />

      <Header />
      <Navigation topics={topics} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MainContent articles={articles} />
          <Sidebar articles={articles} topics={topics} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
