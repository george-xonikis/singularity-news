'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShareIcon,
  ChatBubbleLeftIcon,
  SpeakerWaveIcon,
  EllipsisHorizontalIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import type { Article } from '@singularity-news/shared';

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const [fontSize, setFontSize] = useState(16);
  const [isListening, setIsListening] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) + ' ET';
    }

    // Otherwise show full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) + ' ET';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleListen = () => {
    setIsListening(!isListening);
    // Here you would integrate with a text-to-speech service
  };

  const adjustFontSize = (increase: boolean) => {
    setFontSize(prev => {
      if (increase && prev < 24) return prev + 2;
      if (!increase && prev > 12) return prev - 2;
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Breadcrumb */}
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

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-serif">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
            {article.summary}
          </p>
        )}

        {/* Author and Meta Information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-600">By</span>
              <span className="font-medium text-gray-900">Editorial Team</span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 rounded px-2 py-1 hover:bg-blue-50 transition-colors">
                Follow
              </button>
            </div>
            <p className="text-gray-500 text-sm italic">
              Updated {formatDate(article.updatedAt || article.createdAt)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              title="Share"
            >
              <ShareIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Share</span>
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => adjustFontSize(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Decrease font size"
              >
                <ChevronDownIcon className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-600 mx-2">Resize</span>
              <button
                onClick={() => adjustFontSize(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Increase font size"
              >
                <ChevronUpIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-1 text-gray-600">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{Math.floor(article.views / 10) || 1}</span>
            </div>

            <button
              onClick={toggleListen}
              className={`flex items-center space-x-1 transition-colors ${
                isListening ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Listen to article"
            >
              <SpeakerWaveIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                Listen <span className="text-xs">(2 min)</span>
              </span>
            </button>

            <button
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="More options"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverPhoto && (
          <div className="mb-8">
            <img
              src={article.coverPhoto}
              alt={article.title}
              className="w-full h-auto rounded-lg shadow-lg"
              loading="eager"
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="leading-relaxed text-gray-900"
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
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Metadata */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <span>Published: {formatDate(article.publishedDate || article.createdAt)}</span>
              {article.updatedAt && article.updatedAt !== article.createdAt && (
                <span className="ml-4">Updated: {formatDate(article.updatedAt)}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Related Articles Section Placeholder */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Related Articles</h2>
          <p className="text-gray-600 italic">Related articles will be displayed here.</p>
        </div>
      </article>
    </div>
  );
}