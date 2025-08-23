import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
      <p className="text-gray-600 mb-8">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
        Return to Home
      </Link>
    </main>
  );
}