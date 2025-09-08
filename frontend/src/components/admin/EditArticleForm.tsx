'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleForm, ArticleFormData } from './ArticleForm';
import { ArticleService } from '@/services/articleService';
import { useArticleStore } from '@/stores/articleStore';
import { useAdminStore } from '@/stores/adminStore';
import type { Article, UpdateArticleInput } from '@singularity-news/shared';

interface EditArticleFormProps {
  articleId: string;
}

export function EditArticleForm({ articleId }: EditArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const { setError } = useAdminStore();

  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const articleData = await ArticleService.getArticle(articleId);
      setArticle(articleData);
      setInitialLoading(false);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch article');
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData: ArticleFormData, publish: boolean) => {
    if (!article) return;

    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.content || !formData.topics || !formData.tags) {
        throw new Error('Missing required fields');
      }

      // Prepare the data for update
      const submitData: UpdateArticleInput = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        topics: formData.topics,
        tags: formData.tags,
        published: publish,
        summary: formData.summary,
        author: formData.author,
        coverPhoto: formData.coverPhoto,
        coverPhotoCaption: formData.coverPhotoCaption,
        publishedDate: formData.publishedDate
      };

      // Handle publish date logic
      if (publish && !article.published && !submitData.publishedDate) {
        submitData.publishedDate = new Date().toISOString();
      }

      // Call service directly
      const updatedArticle = await ArticleService.updateArticle(articleId, submitData);

      // Update store with updated article
      const { updateArticle } = useArticleStore.getState();
      updateArticle(articleId, updatedArticle);

      // Navigate to articles list
      router.push('/admin/articles');
    } catch (error) {
      console.error('Failed to update article:', error);
      setError(error instanceof Error ? error.message : 'Failed to update article');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/articles');
  };

  if (initialLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-8 w-48 mb-4 rounded"></div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Article not found
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData: ArticleFormData = {
    title: article.title,
    content: article.content,
    summary: article.summary || '',
    author: article.author || '',
    topics: article.topics,
    coverPhoto: article.coverPhoto || '',
    coverPhotoCaption: article.coverPhotoCaption || '',
    tags: article.tags,
    publishedDate: article.publishedDate || '',
    published: article.published
  };

  return (
    <ArticleForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Update"
      loading={loading}
    />
  );
}