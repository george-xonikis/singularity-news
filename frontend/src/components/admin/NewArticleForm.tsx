'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RichTextEditor } from './RichTextEditor';
import { SearchableTopicDropdown } from './SearchableTopicDropdown';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { CreateArticleInput } from '@singularity-news/shared';
import { ArticleService } from '@/services/articleService';
import { useAdminStore } from '@/stores/adminStore';
import { useTopicStore } from '@/stores/topicStore';
import { useObservableSubscription } from '@/hooks/useObservableSubscription';
import { topics$ } from '@/stores/observables/topics$';

export function NewArticleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { topics, refetch } = useTopicStore();
  const [formData, setFormData] = useState<CreateArticleInput>({
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.content.trim() !== '' &&
      formData.summary?.trim() !== '' &&
      formData.author?.trim() !== '' &&
      formData.topic !== '' &&
      (formData.coverPhoto?.trim() !== '' || uploadPreview !== '') &&
      formData.coverPhotoCaption?.trim() !== '' &&
      formData.tags.length > 0
    );
  };

  // Subscribe to topics observable
  useObservableSubscription(topics$);

  useEffect(() => {
    // Trigger initial fetch if topics are empty
    if (topics.length === 0) {
      refetch();
    }
  }, [topics.length, refetch]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, coverPhoto: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverPhoto: 'Image size must be less than 5MB' }));
        return;
      }

      setUploadedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors(prev => ({ ...prev, coverPhoto: '' }));
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setUploadPreview('');
    setFormData(prev => ({ ...prev, coverPhoto: '' }));
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title.trim()) {
      setErrors(prev => ({ ...prev, title: 'Title is required' }));
      return;
    }

    if (!formData.content.trim()) {
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

      const submitData = {
        ...formData,
        summary: formData.summary || undefined,
        author: formData.author || undefined,
        coverPhoto: coverPhotoUrl || undefined,
        coverPhotoCaption: formData.coverPhotoCaption || undefined,
        published: publish,
        publishedDate: publish ? new Date().toISOString() : null
      };

      await ArticleService.createArticle(submitData);
      router.push('/admin/articles');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create article';
      setErrors({ submit: errorMessage });
      // Also set error in admin store for notification
      const { setError } = useAdminStore.getState();
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter article title"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Summary *
            <span className="text-gray-500 text-xs ml-2">(Brief description for preview)</span>
          </label>
          <textarea
            id="summary"
            value={formData.summary || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a brief summary of the article"
            rows={3}
            maxLength={300}
            required
          />
          <p className="text-gray-500 text-xs mt-1">
            {formData.summary?.length || 0}/300 characters
          </p>
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., John Doe or Editorial Team"
            maxLength={200}
            required
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Topic *
          </label>
          <SearchableTopicDropdown
            topics={topics}
            value={formData.topic}
            onChange={(topicName) => setFormData(prev => ({ ...prev, topic: topicName }))}
            placeholder="Search and select a topic..."
            error={!!errors.topic}
          />
          {errors.topic && <p className="text-red-600 text-sm mt-1">{errors.topic}</p>}
        </div>

        <div>
          <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Photo *
          </label>

          {/* Tab selection for URL or Upload */}
          <div className="flex space-x-4 mb-3">
            <button
              type="button"
              onClick={() => {
                setUploadMode('url');
                setUploadedFile(null);
                setUploadPreview('');
              }}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                uploadMode === 'url'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => {
                setUploadMode('upload');
                setFormData(prev => ({ ...prev, coverPhoto: '' }));
              }}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                uploadMode === 'upload'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Upload
            </button>
          </div>

          {uploadMode === 'url' ? (
            // URL input
            <div>
              <input
                type="url"
                id="coverPhoto"
                value={formData.coverPhoto}
                onChange={(e) => setFormData(prev => ({ ...prev, coverPhoto: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
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
          ) : (
            // File upload
            <div>
              <div className="relative">
                <input
                  type="file"
                  id="coverPhotoFile"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="coverPhotoFile"
                  className="cursor-pointer flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </label>
              </div>

              {uploadPreview && (
                <div className="mt-3 relative">
                  <Image
                    src={uploadPreview}
                    alt="Upload preview"
                    width={192}
                    height={128}
                    className="h-32 w-48 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeUploadedFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {errors.coverPhoto && <p className="text-red-600 text-sm mt-1">{errors.coverPhoto}</p>}
        </div>

        {/* Cover Photo Caption */}
        <div>
          <label htmlFor="coverPhotoCaption" className="block text-sm font-medium text-gray-700 mb-2">
            Photo Caption *
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
            required
          />
          <p className="text-gray-500 text-xs mt-1">
            {formData.coverPhotoCaption?.length || 0}/200 characters
          </p>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags *
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
          {formData.tags.length > 0 && (
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
            value={formData.content}
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
            disabled={loading || !isFormValid()}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading || !isFormValid()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>
    </form>
  );
}