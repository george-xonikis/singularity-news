import Link from 'next/link';
import { Topic } from '@singularity-news/shared';

interface NavigationProps {
  topics: Topic[];
}

export default function Navigation({ topics }: NavigationProps) {
  return (

    <nav className="hidden md:block border-b border-gray-200 py-3 md:py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-center flex-wrap gap-4 sm:gap-6 md:gap-8 text-sm font-medium uppercase text-black">
          <li>
            <Link href="/" className="hover:underline hover:text-blue-600 transition-colors duration-200 py-2 px-1">
              HOME
            </Link>
          </li>
          {topics.slice(0, 5).map(topic => (
            <li key={topic.id}>
              <Link href={`/topics/${topic.slug}`} className="hover:underline hover:text-blue-600 transition-colors duration-200 py-2 px-1">
                {topic.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}