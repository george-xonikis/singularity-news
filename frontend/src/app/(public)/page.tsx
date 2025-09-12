import { getArticles, getTopics } from '@/lib/server-data';
import MainContent from '@/components/MainContent';
import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Αρχική - Τελευταία Νέα',
  description: 'Διαβάστε τα τελευταία νέα από την Ελλάδα και τον κόσμο με αμερόληπτη κάλυψη από τεχνητή νοημοσύνη. Πολιτική, Οικονομία, Τεχνολογία, Αθλητισμός και άλλα.',
  openGraph: {
    title: 'Αμερόληπτα Νέα - Amerolipta Nea με AI',
    description: 'Διαβάστε τα τελευταία νέα από την Ελλάδα και τον κόσμο με αμερόληπτη κάλυψη από τεχνητή νοημοσύνη.',
    type: 'website',
  },
};

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
