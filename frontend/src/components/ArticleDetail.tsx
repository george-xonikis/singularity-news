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
    <div className={isPreview ? 'bg-white border rounded-lg p-6' : 'bg-white'}>
      {/* Preview Mode Indicator */}
      {isPreview && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Preview Mode - This is how your article will appear when published</span>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Breadcrumb */}
        {article.topics && article.topics.length > 0 && (
          <div className="text-center mb-8">
            {article.topics.map((topic, index) => (
              <span key={topic.id}>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                >
                  {topic.name}
                </Link>
                {index < article.topics.length - 1 && (
                  <span className="text-gray-400 mx-2">|</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8 text-center max-w-4xl mx-auto">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="text-xl text-gray-700 leading-relaxed mb-12 text-center font-light max-w-2xl mx-auto">
            {article.summary}
          </p>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center justify-center space-x-6 mb-8 pb-8 border-b border-gray-200">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            title="Share"
          >
            <ShareIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Share</span>
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => adjustFontSize(false)}
              className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
              title="Decrease font size"
            >
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-600">Aa</span>
            <button
              onClick={() => adjustFontSize(true)}
              className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 cursor-pointer"
              title="Increase font size"
            >
              <ChevronUpIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">👂</span>
            <span className="text-sm font-medium">Listen (1 min)</span>
          </div> */}

          <div className="flex items-center space-x-2 text-gray-600">
            <EyeIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{article.views?.toLocaleString() || 0} αναγνώσεις</span>
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

        {/* Author and Date */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            By <span className="font-medium text-gray-900">{article.author || 'Editorial Team'}</span>
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(article.publishedDate || article.createdAt)}
          </p>
        </div>

        {/* Article Content */}
        <div
          className="px-2 prose prose-lg max-w-none"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.7',
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