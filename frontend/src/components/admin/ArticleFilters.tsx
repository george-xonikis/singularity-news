'use client';

import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useAdminStore } from '@/stores/adminStore';
import { useArticleStore } from '@/stores/articleStore';
import { useTopicStore } from '@/stores/topicStore';
import type { ArticleFilters as IArticleFilters } from '@singularity-news/shared';
import { buttonStyles } from '@/styles/buttonStyles';

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
        <button
          onClick={toggleFilters}
          className={`flex items-center gap-2 ${buttonStyles.link} text-slate-600 hover:text-slate-800`}
        >
          <FunnelIcon className="h-5 w-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Title
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                placeholder="Search articles..."
              />
            </div>
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Topic
            </label>
            <select
              value={filters.topic || ''}
              onChange={(e) => handleFilterChange('topic', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Views Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minViews || ''}
                onChange={(e) => handleFilterChange('minViews', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                placeholder="Min"
                min="0"
              />
              <input
                type="number"
                value={filters.maxViews || ''}
                onChange={(e) => handleFilterChange('maxViews', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                placeholder="Max"
                min="0"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}