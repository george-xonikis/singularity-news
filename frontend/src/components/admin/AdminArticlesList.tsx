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
          <h1 className="text-3xl font-bold text-slate-800">Articles</h1>
          <p className="text-slate-600">Manage your news articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer font-medium shadow-sm"
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