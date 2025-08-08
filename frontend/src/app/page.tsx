'use client';

import { useEffect } from 'react';
import { useArticleStore } from '@/store/articleStore';
import { useTopicStore } from '@/store/topicStore';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import MainContent from '@/components/MainContent';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

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
