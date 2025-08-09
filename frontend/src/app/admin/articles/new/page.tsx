import { NewArticleForm } from '@/components/admin/NewArticleForm';

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Create New Article
        </h1>
        <p className="mt-2 text-gray-600">
          Write and publish a new article to your news site
        </p>
      </div>
      
      <NewArticleForm />
    </div>
  );
}