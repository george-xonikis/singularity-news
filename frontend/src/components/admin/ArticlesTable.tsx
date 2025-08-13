'use client';

import {
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useArticleStore } from '@/stores/articleStore';
import { ArticleService } from '@/services/articleService';
import { useAdminStore } from '@/stores/adminStore';

export function ArticlesTable() {
  const {
    articles,
    filters,
    pagination,
    setSort,
    setPage,
    refetch,
  } = useArticleStore();

  const { setError } = useAdminStore();

  // Extract values from filters for convenience
  const { sortBy = 'created_at', sortOrder = 'DESC', limit = 20, offset = 0 } = filters;
  const currentPage = Math.floor(offset / limit) + 1;

  const deleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        ArticleService.deleteArticle(id).then(() => refetch());
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error deleting article';
        setError(errorMessage);
        alert(errorMessage);
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
        sortOrder === 'ASC' ?
          <ArrowUpIcon className="h-4 w-4" /> :
          <ArrowDownIcon className="h-4 w-4" />
      )}
    </button>
  );

  return (
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
                    onClick={() => deleteArticle(article.id)}
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
  );
}