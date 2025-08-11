'use client';

import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useAdminStore } from '@/stores/adminStore';
import { useArticleStore } from '@/stores/articleStore';
import { useTopicStore } from '@/stores/topicStore';
import type { ArticleFilters as IArticleFilters } from '@singularity-news/shared';

export function ArticleFilters() {
  const { showFilters, toggleFilters } = useAdminStore();
  const { filters, setFilters, clearFilters } = useArticleStore();
  const { topics } = useTopicStore();

  const handleFilterChange = (key: keyof IArticleFilters, value: string | number) => {
    if (key === 'minViews' || key === 'maxViews') {
      setFilters({ [key]: value ? parseInt(value as string) : undefined });
    } else {
      setFilters({ [key]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={toggleFilters}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          <FunnelIcon className="h-5 w-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Title
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Search articles..."
              />
            </div>
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              value={filters.topic || ''}
              onChange={(e) => handleFilterChange('topic', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Views Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Views Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minViews || ''}
                onChange={(e) => handleFilterChange('minViews', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Min"
                min="0"
              />
              <input
                type="number"
                value={filters.maxViews || ''}
                onChange={(e) => handleFilterChange('maxViews', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Max"
                min="0"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}