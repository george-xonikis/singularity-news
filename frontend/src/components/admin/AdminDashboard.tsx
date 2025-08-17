'use client';

import { useEffect, useState } from 'react';
import {
  DocumentTextIcon,
  EyeIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { DashboardService, type DashboardStats, type RecentArticle } from '@/services/dashboardService';
import Link from 'next/link';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, articlesData] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getRecentArticles()
        ]);
        setStats(statsData);
        setRecentArticles(articlesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateChange = (current: number, lastMonth: number): string => {
    if (lastMonth === 0) return 'N/A';
    const change = ((current - lastMonth) / lastMonth * 100).toFixed(0);
    return current >= lastMonth ? `+${change}%` : `${change}%`;
  };

  const statCards = stats ? [
    {
      name: 'Total Articles',
      value: stats.totalArticles.toString(),
      change: `${stats.publishedArticles} published`,
      changeType: 'neutral' as const,
      icon: DocumentTextIcon
    },
    {
      name: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: calculateChange(stats.totalViews, stats.lastMonthViews),
      changeType: stats.totalViews >= stats.lastMonthViews ? 'positive' as const : 'negative' as const,
      icon: EyeIcon
    },
    {
      name: 'Active Topics',
      value: stats.totalTopics.toString(),
      change: 'topics',
      changeType: 'neutral' as const,
      icon: TagIcon
    },
    {
      name: 'Avg. Views/Article',
      value: stats.averageViews.toLocaleString(),
      change: 'per article',
      changeType: 'neutral' as const,
      icon: ChartBarIcon
    },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back to Singularity News admin panel
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    {stat.changeType !== 'neutral' && (
                      <span className="text-sm text-gray-600 ml-1">vs last month</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Articles
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/admin/articles/${article.id}/edit`}
                  className="block hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-gray-900 hover:text-indigo-600">
                        {article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {article.views.toLocaleString()} views • {article.topic}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      article.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.published ? 'published' : 'draft'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No articles yet. Create your first article to get started.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/articles/new"
              className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded text-white mr-3">
                  <DocumentTextIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create New Article</h3>
                  <p className="text-sm text-gray-600">Write and publish new content</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/topics"
              className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-600 rounded text-white mr-3">
                  <EyeIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create New Topic</h3>
                  <p className="text-sm text-gray-600">Create or edit existing topics</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}