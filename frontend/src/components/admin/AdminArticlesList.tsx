'use client';

import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useObservableSubscription } from '@/hooks/useObservableSubscription';
import { articles$ } from '@/stores/observables/articles$';
import { topics$ } from '@/stores/observables/topics$';
import { ArticleFilters } from './ArticleFilters';
import { ArticlesTable } from './ArticlesTable';

export function AdminArticlesList() {
  // Subscribe to both observables
  useObservableSubscription(articles$);
  useObservableSubscription(topics$);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600">Manage your news articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Article
        </Link>
      </div>

      <ArticleFilters />

      <ArticlesTable />
    </div>
  );
}