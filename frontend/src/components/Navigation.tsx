import Link from 'next/link';
import { Topic } from '@singularity-news/shared';

interface NavigationProps {
  topics: Topic[];
}

export default function Navigation({ topics }: NavigationProps) {
  return (
    <nav className="border-b border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 text-sm font-medium uppercase text-black">
          <li>
            <Link href="/" className="hover:underline hover:text-blue-600">
              HOME
            </Link>
          </li>
          {topics.slice(0, 5).map(topic => (
            <li key={topic.id}>
              <Link href={`/topics/${topic.slug}`} className="hover:underline hover:text-blue-600">
                {topic.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}