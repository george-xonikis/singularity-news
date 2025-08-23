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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation topics={topics} />
      {children}
      <Footer />
    </div>
  );
}