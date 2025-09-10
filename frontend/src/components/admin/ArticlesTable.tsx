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
import { TableHeader, TableCell } from '@/components/ui/TableComponents';

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
      className="flex items-center gap-1 hover:text-amber-600 transition-colors cursor-pointer"
    >
      {children}
      {sortBy === field && (
        sortOrder === 'ASC' ?
          <ArrowUpIcon className="h-4 w-4 text-amber-500" /> :
          <ArrowDownIcon className="h-4 w-4 text-amber-500" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100">
            <tr className="border-b border-slate-200">
              <TableHeader>
                <SortButton field="created_at">Date</SortButton>
              </TableHeader>
              <TableHeader>
                <SortButton field="title">Title</SortButton>
              </TableHeader>
              <TableHeader>
                <SortButton field="topics">Topics</SortButton>
              </TableHeader>
              <TableHeader>
                <SortButton field="views">Views</SortButton>
              </TableHeader>
              <TableHeader>
                Status
              </TableHeader>
              <TableHeader>
                Actions
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, index) => (
              <tr
                key={article.id}
                className={`${index !== articles.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 cursor-pointer transition-colors duration-150`}
                onClick={() => window.open(`/admin/articles/${article.id}/edit`, '_blank')}
              >
                <TableCell>
                  <span className="text-slate-600">{formatDate(article.createdAt)}</span>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900" title={article.title}>
                    {article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {article.topics.map((topic, idx) => (
                      <span key={topic.id} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {topic.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-600 font-medium">{article.views.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    article.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No articles found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Showing{' '}
                  <span className="font-medium text-slate-900">{(currentPage - 1) * pagination.limit + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium text-slate-900">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium text-slate-900">{pagination.total}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer transition-colors ${
                          currentPage === page
                            ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                            : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, currentPage + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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