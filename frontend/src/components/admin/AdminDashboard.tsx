import { 
  DocumentTextIcon, 
  EyeIcon, 
  TagIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export function AdminDashboard() {
  const stats = [
    { 
      name: 'Total Articles', 
      value: '24', 
      change: '+4', 
      changeType: 'positive',
      icon: DocumentTextIcon 
    },
    { 
      name: 'Total Views', 
      value: '12,345', 
      change: '+12%', 
      changeType: 'positive',
      icon: EyeIcon 
    },
    { 
      name: 'Active Topics', 
      value: '8', 
      change: '+1', 
      changeType: 'positive',
      icon: TagIcon 
    },
    { 
      name: 'Avg. Views/Article', 
      value: '514', 
      change: '+8%', 
      changeType: 'positive',
      icon: ChartBarIcon 
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back to Singularity News admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif">
            Recent Articles
          </h2>
          <div className="space-y-4">
            {[
              { title: 'The Future of AI in Healthcare', views: 1243, status: 'published' },
              { title: 'Quantum Computing Breakthrough', views: 892, status: 'published' },
              { title: 'Space Tourism Updates', views: 654, status: 'draft' },
            ].map((article, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <h3 className="font-medium text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.views} views</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  article.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {article.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif">
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
              href="/admin/articles"
              className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-600 rounded text-white mr-3">
                  <EyeIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Articles</h3>
                  <p className="text-sm text-gray-600">Edit existing content</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}