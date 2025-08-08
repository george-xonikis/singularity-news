import { Topic } from '@/api/dataLayer';

interface NavigationProps {
  topics: Topic[];
}

export default function Navigation({ topics }: NavigationProps) {
  return (
    <nav className="border-b border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 text-sm font-medium uppercase">
          <li>
            <a href="#" className="hover:underline">
              HOME
            </a>
          </li>
          {topics.slice(0, 5).map(topic => (
            <li key={topic.id}>
              <a href="#" className="hover:underline">
                {topic.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
