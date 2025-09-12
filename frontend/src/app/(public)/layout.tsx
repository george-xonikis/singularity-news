import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getTopics } from '@/lib/server-data';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const topics = await getTopics();

  // Debug logging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Topics fetched:', topics.length, topics.map(t => t.name));
  }

  return (
    <div className="min-h-screen bg-white">
      <Header topics={topics} />
      <Navigation topics={topics} />
      {children}
      <Footer />
    </div>
  );
}