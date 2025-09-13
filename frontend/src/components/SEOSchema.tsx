import Script from 'next/script';
import { SITE_URL } from '@/config/env';

interface SEOSchemaProps {
  type: 'website' | 'organization' | 'news-media';
  url?: string;
}

export function SEOSchema({ type, url }: SEOSchemaProps) {

  const schemas = {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Αμερόληπτα Νέα',
      alternateName: 'Amerolipta Nea',
      url: SITE_URL,
      description: 'Αμερόληπτα νέα με τεχνητή νοημοσύνη. Διαβάστε τα τελευταία νέα από την Ελλάδα και τον κόσμο.',
      inLanguage: 'el-GR',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: 'Αμερόληπτα Νέα',
      alternateName: 'Amerolipta Nea',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 400,
        height: 400,
      },
      sameAs: [
        // Add social media URLs when available
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'editorial',
        availableLanguage: ['Greek', 'English'],
      },
      publishingPrinciples: `${SITE_URL}/about/editorial-policy`,
      actionableFeedbackPolicy: `${SITE_URL}/about/feedback`,
      diversityPolicy: `${SITE_URL}/about/diversity`,
      ethicsPolicy: `${SITE_URL}/about/ethics`,
    },
    'news-media': {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Τελευταία Νέα - Αμερόληπτα Νέα',
      description: 'Διαβάστε τα τελευταία νέα από την Ελλάδα και τον κόσμο με αμερόληπτη κάλυψη.',
      url: url || SITE_URL,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: 'dynamic',
        itemListElement: [],
      },
      isPartOf: {
        '@type': 'WebSite',
        name: 'Αμερόληπτα Νέα',
        url: SITE_URL,
      },
    },
  };

  return (
    <Script
      id={`schema-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas[type]),
      }}
    />
  );
}