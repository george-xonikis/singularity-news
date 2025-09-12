import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: {
    default: 'Αμερόληπτα Νέα - Amerolipta Nea με AI',
    template: '%s | Αμερόληπτα Νέα'
  },
  description: 'Αμερόληπτα νέα με τεχνητή νοημοσύνη. Διαβάστε τα τελευταία νέα από την Ελλάδα και τον κόσμο με αντικειμενική ανάλυση από AI.',
  keywords: ['νέα', 'ειδήσεις', 'Ελλάδα', 'τεχνητή νοημοσύνη', 'AI', 'αμερόληπτα νέα', 'news', 'Greece', 'artificial intelligence'],
  authors: [{ name: 'Αμερόληπτα Νέα' }],
  creator: 'Αμερόληπτα Νέα',
  publisher: 'Αμερόληπτα Νέα',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    alternateLocale: 'en_US',
    url: SITE_URL,
    siteName: 'Singularity News',
    title: 'Singularity News - Αμερόληπτα Νέα με AI',
    description: 'Αμερόληπτα νέα με τεχνητή νοημοσύνη. Διαβάστε τα τελευταία νέα από την Ελλάδα και τον κόσμο.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Singularity News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Singularity News - Αμερόληπτα Νέα με AI',
    description: 'Αμερόληπτα νέα με τεχνητή νοημοσύνη. Διαβάστε τα τελευταία νέα από την Ελλάδα και τον κόσμο.',
    images: ['/og-image.png'],
    creator: '@singularitynews',
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
  category: 'news',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
