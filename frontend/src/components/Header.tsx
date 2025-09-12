import Link from 'next/link';
import Image from 'next/image';
import { Topic } from '@singularity-news/shared';
import MobileMenuWrapper from './MobileMenuWrapper';
import MobileNavigation from './MobileNavigation';

interface HeaderProps {
  topics: Topic[];
}

export default function Header({ topics }: HeaderProps) {
  // Get current date in Greek format
  const getGreekDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const dateStr = date.toLocaleDateString('el-GR', options);
    const parts = dateStr.split(' ');
    if (parts.length === 4) {
      return `${parts[0]}, ${parts[1]} ${parts[2]}, ${parts[3]}`;
    }
    return dateStr;
  };

  return (
    <header className="border-b border-gray-300">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <MobileMenuWrapper>
            <MobileNavigation topics={topics} />
          </MobileMenuWrapper>
          <div className="text-center flex-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.svg" alt="AI News Logo" width={32} height={32} className="text-black" />
              <h1 className="text-xl font-bold text-black hover:text-blue-600 transition-colors">Αμερόληπτα Νέα</h1>
            </Link>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
        <div className="bg-gray-100 px-3 py-2 text-left border-b border-gray-200">
          <span className="text-xs font-bold text-gray-800">
            {getGreekDate()}
          </span>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image src="/logo.svg" alt="AI News Logo" width={48} height={48} className="text-black" />
            <h1 className="text-4xl font-bold text-black">Αμερόληπτα Νέα</h1>
          </div>
          <p className="text-center text-gray-600">{getGreekDate()}</p>
        </div>
      </div>
    </header>
  );
}
