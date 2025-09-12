'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Article, Topic } from '@singularity-news/shared';

interface RelatedArticlesProps {
  currentArticleId: string;
  currentTopics: Topic[];
  currentTags?: string[];
}

export function RelatedArticles({ currentArticleId, currentTopics, currentTags = [] }: RelatedArticlesProps) {
  const [relatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch related articles based on topics and tags
    // For now, we'll just show a placeholder
    setLoading(false);
  }, [currentArticleId, currentTopics, currentTags]);

  if (loading) {
    return (
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Συναφή Άρθρα</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedArticles.length === 0) {
    return (
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Συναφή Άρθρα</h2>
        <p className="text-gray-600 italic">Δεν βρέθηκαν</p>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Συναφή Άρθρα</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group"
          >
            <article className="cursor-pointer">
              {article.coverPhoto && (
                <div className="relative h-48 mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={article.coverPhoto}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {article.summary}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <div className="flex flex-wrap gap-1">
                  {article.topics.map((topic) => (
                    <span key={topic.id} className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                      {topic.name}
                    </span>
                  ))}
                </div>
                <span className="mx-2">•</span>
                <span>{new Date(article.publishedDate || article.createdAt).toLocaleDateString()}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}