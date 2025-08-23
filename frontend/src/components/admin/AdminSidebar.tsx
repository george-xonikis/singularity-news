'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NewspaperIcon,
  DocumentTextIcon,
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
    <div className="w-64 min-h-screen fixed left-0 top-0 bg-slate-700 shadow-xl z-10">
      <Link href="/admin">
        <div className="p-6 border-b border-slate-600 cursor-pointer hover:bg-slate-600 transition-colors duration-200">
          <div className="flex items-center">
            <NewspaperIcon className="h-8 w-8 text-amber-400" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-slate-100">
                Admin
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
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-100 hover:bg-slate-600'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}
                    `}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-600 bg-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-100">Admin User</p>
              <p className="text-xs text-slate-400">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}