'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  NewspaperIcon, 
  DocumentTextIcon, 
  PlusIcon, 
  TagIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: ChartBarIcon 
  },
  { 
    name: 'Articles', 
    href: '/admin/articles', 
    icon: DocumentTextIcon 
  },
  { 
    name: 'New Article', 
    href: '/admin/articles/new', 
    icon: PlusIcon 
  },
  { 
    name: 'Topics', 
    href: '/admin/topics', 
    icon: TagIcon 
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: CogIcon 
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <Link href="/admin">
        <div className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
          <div className="flex items-center">
            <NewspaperIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 font-serif">
                Singularity Admin
              </h1>
            </div>
          </div>
        </div>
      </Link>
      
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                    `}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-600">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}