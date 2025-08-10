'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useAdminStore } from '@/stores/adminStore';

export function AdminArticlesList() {
  const {
    articles,
    topics,
    loading,
    sortBy,
    sortOrder,
    currentPage,
    pagination,
    filters,
    showFilters,
    setFilters,
    clearFilters,
    setSort,
    setPage,
    toggleFilters,
    fetchArticles,
    fetchTopics,
    deleteArticle,
  } = useAdminStore();

  useEffect(() => {
    fetchTopics();
    fetchArticles();
  }, [fetchTopics, fetchArticles]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ [key]: value });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error deleting article');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => setSort(field)}
      className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer"
    >
      {children}
      {sortBy === field && (
        sortOrder === 'asc' ? 
          <ArrowUpIcon className="h-4 w-4" /> : 
          <ArrowDownIcon className="h-4 w-4" />
      )}
    </button>
  );

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

      {/* Filters */}
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
                  value={filters.search}
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
                value={filters.topic}
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
                  value={filters.minViews}
                  onChange={(e) => handleFilterChange('minViews', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Min"
                  min="0"
                />
                <input
                  type="number"
                  value={filters.maxViews}
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
                value={filters.startDate}
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
                value={filters.endDate}
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

      {/* Articles Table */}
      <div className="bg-white rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-base font-bold text-gray-700">
                  <SortButton field="created_at">Date</SortButton>
                </th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-700">
                  <SortButton field="title">Title</SortButton>
                </th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-700">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-700">
                  <SortButton field="topic">Topic</SortButton>
                </th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-700">
                  <SortButton field="views">Views</SortButton>
                </th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <tr 
                  key={article.id} 
                  className={`${index !== articles.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 cursor-pointer`}
                  onClick={() => window.open(`/admin/articles/${article.id}/edit`, '_blank')}
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900" title={article.title}>
                      {article.title.length > 20 ? article.title.substring(0, 20) + '...' : article.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600" title={article.slug}>
                      {article.slug.length > 20 ? article.slug.substring(0, 20) + '...' : article.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {article.topic}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      article.published 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.limit, pagination.total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{pagination.total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
                            currentPage === page
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}