'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RichTextEditor } from './RichTextEditor';
import { SearchableTopicDropdown } from './SearchableTopicDropdown';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Article, UpdateArticleInput } from '@singularity-news/shared';
import { ArticleService } from '@/services/articleService';
import { useArticleStore } from '@/stores/articleStore';
import { useAdminStore } from '@/stores/adminStore';
import { useTopicStore } from '@/stores/topicStore';
import { useObservableSubscription } from '@/hooks/useObservableSubscription';
import { topics$ } from '@/stores/observables/topics$';

interface EditArticleFormProps {
  articleId: number;
}

export function EditArticleForm({ articleId }: EditArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { topics, refetch: refetchTopics } = useTopicStore();
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<UpdateArticleInput>({
    title: '',
    content: '',
    summary: '',
    author: '',
    topic: '',
    coverPhoto: '',
    coverPhotoCaption: '',
    tags: [],
    publishedDate: '',
    published: false
  });
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // TODO: Implement file upload UI in EditArticleForm
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadPreview, setUploadPreview] = useState<string>('');

  // Subscribe to topics observable
  useObservableSubscription(topics$);

  useEffect(() => {
    // Trigger initial fetch if topics are empty
    if (topics.length === 0) {
      refetchTopics();
    }
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      // Call service directly
      const articleData = await ArticleService.getArticle(String(articleId));
      setArticle(articleData);
      setFormData({
        title: articleData.title,
        content: articleData.content,
        summary: articleData.summary || '',
        author: articleData.author || '',
        topic: articleData.topic,
        coverPhoto: articleData.coverPhoto || '',
        coverPhotoCaption: articleData.coverPhotoCaption || '',
        tags: articleData.tags || [],
        publishedDate: articleData.publishedDate || '',
        published: articleData.published
      });
    } catch {
      setErrors({ fetch: 'Failed to load article' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title?.trim()) {
      setErrors(prev => ({ ...prev, title: 'Title is required' }));
      return;
    }

    if (!formData.content?.trim()) {
      setErrors(prev => ({ ...prev, content: 'Content is required' }));
      return;
    }

    if (!formData.topic) {
      setErrors(prev => ({ ...prev, topic: 'Topic is required' }));
      return;
    }

    setLoading(true);

    try {
      // If there's an uploaded file, we need to upload it first
      let coverPhotoUrl = formData.coverPhoto;

      if (uploadedFile) {
        // TODO: Implement actual file upload to storage service
        // For now, we'll use the base64 preview as a placeholder
        // In production, this should upload to Firebase Storage, S3, etc.
        coverPhotoUrl = uploadPreview;
      }

      const submitData: UpdateArticleInput = {
        ...formData,
        summary: formData.summary || undefined,
        author: formData.author || undefined,
        coverPhoto: coverPhotoUrl || undefined,
        coverPhotoCaption: formData.coverPhotoCaption || undefined,
      };

      if (publish !== undefined) {
        submitData.published = publish;
        if (publish && !article?.published) {
          submitData.publishedDate = new Date().toISOString();
        }
      }

      // Call service directly
      const updatedArticle = await ArticleService.updateArticle(String(articleId), submitData);

      // Update store with updated article
      const { updateArticle } = useArticleStore.getState();
      updateArticle(String(articleId), updatedArticle);

      // Navigate to articles list
      router.push('/admin/articles');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update article';
      setErrors({ submit: errorMessage });
      // Also set error in admin store for notification
      const { setError } = useAdminStore.getState();
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{errors.fetch}</p>
        <button
          onClick={() => router.push('/admin/articles')}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter article title"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Topic *
          </label>
          <SearchableTopicDropdown
            topics={topics}
            value={formData.topic || ''}
            onChange={(topicName) => setFormData(prev => ({ ...prev, topic: topicName }))}
            placeholder="Search and select a topic..."
            error={!!errors.topic}
          />
          {errors.topic && <p className="text-red-600 text-sm mt-1">{errors.topic}</p>}
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Summary
            <span className="text-gray-500 text-xs ml-2">(Brief description of the article)</span>
          </label>
          <textarea
            id="summary"
            value={formData.summary || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="A brief summary of the article that will appear in listings..."
            rows={3}
            maxLength={300}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.summary?.length || 0}/300
          </div>
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author
            <span className="text-gray-500 text-xs ml-2">(Leave blank for &quot;Editorial Team&quot;)</span>
          </label>
          <input
            type="text"
            id="author"
            value={formData.author || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., John Doe or Editorial Team"
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Photo URL
          </label>
          <div className="flex space-x-3">
            <input
              type="url"
              id="coverPhoto"
              value={formData.coverPhoto || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, coverPhoto: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <PhotoIcon className="h-4 w-4" />
              Upload
            </button>
          </div>
          {formData.coverPhoto && (
            <div className="mt-3">
              <Image
                src={formData.coverPhoto}
                alt="Preview"
                width={192}
                height={128}
                className="h-32 w-48 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {formData.coverPhoto && (
          <div>
            <label htmlFor="coverPhotoCaption" className="block text-sm font-medium text-gray-700 mb-2">
              Photo Caption
              <span className="text-gray-500 text-xs ml-2">(Description/Credit for the image)</span>
            </label>
            <input
              type="text"
              id="coverPhotoCaption"
              value={formData.coverPhotoCaption || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, coverPhotoCaption: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., President meets with officials at summit - Photo by John Doe/Reuters"
              maxLength={200}
            />
          </div>
        )}

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Add
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-blue-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            value={formData.content || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            placeholder="Write your article content here..."
          />
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{errors.submit}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin/articles')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {!article?.published && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Publishing...' : 'Publish Now'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}