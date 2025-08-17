'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RichTextEditor } from './RichTextEditor';
import { SearchableTopicDropdown } from './SearchableTopicDropdown';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { CreateArticleInput, UpdateArticleInput } from '@singularity-news/shared';
import { useTopicStore } from '@/stores/topicStore';
import { useObservableSubscription } from '@/hooks/useObservableSubscription';
import { topics$ } from '@/stores/observables/topics$';

export type ArticleFormData = CreateArticleInput | UpdateArticleInput;

interface ArticleFormProps {
  initialData?: ArticleFormData;
  onSubmit: (data: ArticleFormData, publish: boolean) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function ArticleForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  loading = false
}: ArticleFormProps) {
  const { topics } = useTopicStore();
  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
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
    }
  );
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [_uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');

  // Subscribe to topics observable
  useObservableSubscription(topics$);

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.title?.trim() !== '' &&
      formData.content?.trim() !== '' &&
      formData.summary?.trim() !== '' &&
      formData.author?.trim() !== '' &&
      formData.topic?.trim() !== '' &&
      (formData.coverPhoto?.trim() !== '' || uploadPreview !== '') &&
      formData.coverPhotoCaption?.trim() !== '' &&
      (formData.tags?.length || 0) > 0
    );
  };

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
    // Reset file input
    const fileInput = document.getElementById('cover-photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (publish: boolean) => {
    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!formData.summary?.trim()) {
      newErrors.summary = 'Summary is required';
    }
    if (!formData.author?.trim()) {
      newErrors.author = 'Author is required';
    }
    if (!formData.topic?.trim()) {
      newErrors.topic = 'Topic is required';
    }
    if (!formData.coverPhoto?.trim() && !uploadPreview) {
      newErrors.coverPhoto = 'Cover photo is required';
    }
    if (!formData.coverPhotoCaption?.trim()) {
      newErrors.coverPhotoCaption = 'Cover photo caption is required';
    }
    if (!formData.tags || formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare submit data
    const submitData: ArticleFormData = {
      ...formData,
      published: publish,
      coverPhoto: uploadPreview || formData.coverPhoto
    };

    // If publishing and no published date, set it
    if (publish && !submitData.publishedDate) {
      submitData.publishedDate = new Date().toISOString();
    }

    await onSubmit(submitData, publish);
  };

  return (
    <form className="space-y-8 bg-white rounded-lg shadow-lg p-12">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
            errors.title
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="Enter article title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          Summary <span className="text-red-500">*</span>
          {formData.summary && (
            <span className="ml-2 text-xs text-gray-500">
              ({formData.summary.length}/400)
            </span>
          )}
        </label>
        <textarea
          id="summary"
          value={formData.summary || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value.slice(0, 400) }))}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-3 py-4 leading-relaxed ${
            errors.summary
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          rows={3}
          placeholder="Brief summary of the article (max 400 characters)"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
        )}
      </div>

      {/* Author */}
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="author"
          value={formData.author || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
            errors.author
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="Enter author name"
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600">{errors.author}</p>
        )}
      </div>

      {/* Topic */}
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
          Topic <span className="text-red-500">*</span>
        </label>
        <SearchableTopicDropdown
          topics={topics}
          value={formData.topic || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
          error={!!errors.topic}
        />
        {errors.topic && (
          <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 text-indigo-400 hover:text-indigo-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
        )}
      </div>

      {/* Cover Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cover Photo <span className="text-red-500">*</span>
        </label>

        {/* Tab switcher */}
        <div className="mt-2 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                uploadMode === 'url'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                uploadMode === 'upload'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload
            </button>
          </nav>
        </div>

        {/* URL input */}
        {uploadMode === 'url' && (
          <div className="mt-4">
            <input
              type="url"
              value={formData.coverPhoto || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, coverPhoto: e.target.value }))}
              className={`block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                errors.coverPhoto
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {/* File upload */}
        {uploadMode === 'upload' && (
          <div className="mt-4">
            {!uploadPreview ? (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="cover-photo-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="cover-photo-upload"
                        name="cover-photo-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={uploadPreview}
                  alt="Cover photo preview"
                  width={300}
                  height={200}
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={removeUploadedFile}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {errors.coverPhoto && (
          <p className="mt-1 text-sm text-red-600">{errors.coverPhoto}</p>
        )}

        {/* Preview for URL mode */}
        {uploadMode === 'url' && formData.coverPhoto && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <Image
              src={formData.coverPhoto}
              alt="Cover photo preview"
              width={300}
              height={200}
              className="rounded-md"
            />
          </div>
        )}
      </div>

      {/* Cover Photo Caption - Only show if cover photo exists */}
      {(formData.coverPhoto || uploadPreview) && (
        <div>
          <label htmlFor="coverPhotoCaption" className="block text-sm font-medium text-gray-700">
            Cover Photo Caption <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="coverPhotoCaption"
            value={formData.coverPhotoCaption || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, coverPhotoCaption: e.target.value }))}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
              errors.coverPhotoCaption
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
            placeholder="Describe the image or provide credit"
          />
          {errors.coverPhotoCaption && (
            <p className="mt-1 text-sm text-red-600">{errors.coverPhotoCaption}</p>
          )}
        </div>
      )}

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <RichTextEditor
            value={formData.content || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading || !isFormValid()}
            className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading || !isFormValid()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
            }`}
          >
            {loading ? 'Saving...' : `${submitLabel} as Draft`}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading || !isFormValid()}
            className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading || !isFormValid()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Publishing...' : `Publish`}
          </button>
        </div>
      </div>
    </form>
  );
}