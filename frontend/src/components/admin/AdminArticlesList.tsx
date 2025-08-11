'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAdminStore } from '@/stores/adminStore';
import { useTopicStore } from '@/stores/topicStore';
import { useObservableSubscription } from '@/hooks/useObservableSubscription';
import { articles$ } from '@/stores/observables/articles$';
import { ArticleFilters } from './ArticleFilters';
import { ArticlesTable } from './ArticlesTable';

export function AdminArticlesList() {
  useObservableSubscription(articles$);

  // Admin app-level state
  const { loading } = useAdminStore();

  // Topic store
  const { fetchTopics } = useTopicStore();

  useEffect(() => {
    // Fetch topics once - articles are handled by RxJS subscription
    fetchTopics();
  }, [fetchTopics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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