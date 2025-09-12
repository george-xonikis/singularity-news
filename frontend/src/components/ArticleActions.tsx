'use client';

import { useState, useEffect } from 'react';
import {
  ShareIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import type { Article } from '@singularity-news/shared';
import { ShareService } from '@/services/shareService';

interface ArticleActionsProps {
  article: Article;
  isPreview?: boolean;
}

export function ArticleActions({ article, isPreview = false }: ArticleActionsProps) {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const contentElement = document.getElementById('article-content');
    if (contentElement) {
      contentElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  const handleShare = async () => {
    if (isPreview) return;
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

      <div className="flex items-center space-x-2 text-gray-600">
        <EyeIcon className="h-4 w-4" />
        <span className="text-sm font-medium">{article.views?.toLocaleString() || 0} αναγνώσεις</span>
      </div>
    </div>
  );
}