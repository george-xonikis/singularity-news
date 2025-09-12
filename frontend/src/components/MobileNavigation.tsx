import Link from 'next/link';
import { Topic } from '@singularity-news/shared';

interface MobileNavigationProps {
  topics: Topic[];
}

export default function MobileNavigation({ topics }: MobileNavigationProps) {
  return (
    <nav className="px-4 py-6">
      <ul className="space-y-1">
        <li>
          <Link
            href="/"
            className="block py-3 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            Αρχική
          </Link>
        </li>
        {topics.length > 0 ? (
          topics.map(topic => (
            <li key={topic.id}>
              <Link
                href={`/topics/${topic.slug}`}
                className="block py-3 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {topic.name}
              </Link>
            </li>
          ))
        ) : (
          <li className="py-3 text-gray-500 italic">
            Δεν υπάρχουν διαθέσιμες κατηγορίες
          </li>
        )}
      </ul>
    </nav>
  );
}