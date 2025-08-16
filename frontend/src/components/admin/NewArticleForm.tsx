'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleForm, ArticleFormData } from './ArticleForm';
import { ArticleService } from '@/services/articleService';
import { useAdminStore } from '@/stores/adminStore';
import type { CreateArticleInput } from '@singularity-news/shared';

export function NewArticleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setError } = useAdminStore();

  const handleSubmit = async (formData: ArticleFormData, publish: boolean) => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.content || !formData.topic || !formData.tags) {
        throw new Error('Missing required fields');
      }

      // Prepare the data for creation
      const submitData: CreateArticleInput = {
        title: formData.title,
        content: formData.content,
        topic: formData.topic,
        tags: formData.tags,
        published: publish,
        summary: formData.summary,
        author: formData.author,
        coverPhoto: formData.coverPhoto,
        coverPhotoCaption: formData.coverPhotoCaption,
        publishedDate: formData.publishedDate || (publish ? new Date().toISOString() : undefined)
      };

      // Call service directly
      await ArticleService.createArticle(submitData);

      // Navigate to articles list
      router.push('/admin/articles');
    } catch (error) {
      console.error('Failed to create article:', error);
      setError(error instanceof Error ? error.message : 'Failed to create article');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/articles');
  };

  return (
    <ArticleForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Save"
      loading={loading}
    />
  );
}