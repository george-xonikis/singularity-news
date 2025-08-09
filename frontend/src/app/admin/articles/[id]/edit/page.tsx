import { EditArticleForm } from '@/components/admin/EditArticleForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Edit Article
        </h1>
        <p className="mt-2 text-gray-600">
          Make changes to your article
        </p>
      </div>
      
      <EditArticleForm articleId={parseInt(id)} />
    </div>
  );
}