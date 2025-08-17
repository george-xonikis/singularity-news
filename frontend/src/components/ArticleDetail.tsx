'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShareIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import type { Article } from '@singularity-news/shared';
import { ShareService } from '@/services/shareService';

interface ArticleDetailProps {
  article: Article;
  isPreview?: boolean;
  children?: React.ReactNode;
}

export function ArticleDetail({ article, isPreview = false, children }: ArticleDetailProps) {
  const [fontSize, setFontSize] = useState(16);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format: Aug. 17, 2025 10:16 am (in user's local timezone)
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();

    // Get timezone abbreviation (e.g., EST, PST, GMT)
    const timeZone = date.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ').pop() || '';

    return `${month}. ${day}, ${year} ${time} ${timeZone}`;
  };

  const handleShare = async () => {
    if (isPreview) return; // Disable sharing in preview mode

    const shareUrl = ShareService.generateArticleUrl(article.slug);
    await ShareService.shareArticle(article.title, article.summary, shareUrl);
  };

  const adjustFontSize = (increase: boolean) => {
    setFontSize(prev => {
      if (increase && prev < 24) return prev + 2;
      if (!increase && prev > 12) return prev - 2;
      return prev;
    });
  };

  return (
    <div className={isPreview ? 'bg-white border rounded-lg p-6' : 'min-h-screen bg-white'}>
      {/* Preview Mode Indicator */}
      {isPreview && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Preview Mode - This is how your article will appear when published</span>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      {!isPreview && (
        <div className="border-b border-gray-200 py-2">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/topics/${article.topic.toLowerCase()}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 uppercase tracking-wide"
            >
              {article.topic}
            </Link>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Headline */}
        <h1 
          className="font-bold text-gray-900 leading-tight mb-4"
          style={{ fontSize: `${fontSize * 2}px` }}
        >
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p 
            className="text-gray-600 leading-relaxed mb-8"
            style={{ fontSize: `${fontSize * 1.125}px` }}
          >
            {article.summary}
          </p>
        )}

        {/* Author and Meta Information */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          {/* First Row: Author and Views */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">By</span>
              <span className="font-bold text-gray-900">{article.author || 'Editorial Team'}</span>
            </div>
            <span className="font-bold text-gray-900">{article.views.toLocaleString()} views</span>
          </div>

          {/* Second Row: Updated Date */}
          <p className="text-gray-500 text-sm italic mb-4">
            {formatDate(article.publishedDate || article.createdAt)}
          </p>

          {/* Third Row: Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all duration-200 transform hover:scale-105 cursor-pointer"
              title="Share"
            >
              <ShareIcon className="h-5 w-5" />
              <span className="text-sm font-semibold">Share</span>
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => adjustFontSize(false)}
                className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
                title="Decrease font size"
              >
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-sm font-bold text-gray-600 mx-2">Aa</span>
              <button
                onClick={() => adjustFontSize(true)}
                className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
                title="Increase font size"
              >
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverPhoto && (
          <figure className="mb-8">
            <Image
              src={article.coverPhoto}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
              priority
            />
            {article.coverPhotoCaption && (
              <figcaption className="mt-2 text-sm text-gray-600 italic">
                {article.coverPhotoCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.8',
            letterSpacing: '0.01em'
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="text-gray-900"
            style={{
              lineHeight: 'inherit',
              letterSpacing: 'inherit'
            }}
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="inline-block bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 text-sm px-3 py-1 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles Section - Content Projection */}
        {!isPreview && children}
      </article>
    </div>
  );
}