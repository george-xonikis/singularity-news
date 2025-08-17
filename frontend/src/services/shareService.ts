/**
 * Service for handling article sharing functionality
 */
export class ShareService {
  /**
   * Share an article using the Web Share API or fallback to clipboard
   * @param title - Article title
   * @param summary - Article summary/description
   * @param url - URL to share (optional, defaults to current location)
   * @returns Promise<boolean> - true if shared successfully
   */
  static async shareArticle(
    title: string,
    summary?: string,
    url?: string
  ): Promise<boolean> {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    // Check if Web Share API is available
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
          url: shareUrl,
        });
        return true;
      } catch {
        // User cancelled or error occurred
        // Share cancelled or failed - this is normal when user cancels
        return false;
      }
    }

    // Fallback: copy to clipboard
    return this.copyToClipboard(shareUrl);
  }

  /**
   * Copy text to clipboard
   * @param text - Text to copy
   * @returns Promise<boolean> - true if copied successfully
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Failed to copy to clipboard
      return false;
    }
  }

  /**
   * Generate a shareable URL for an article
   * @param slug - Article slug
   * @param baseUrl - Base URL of the site
   * @returns string - Full shareable URL
   */
  static generateArticleUrl(slug: string, baseUrl?: string): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${base}/articles/${slug}`;
  }

  /**
   * Share via specific platform
   * @param platform - Social media platform
   * @param url - URL to share
   * @param title - Title/text to share
   */
  static shareViaPlatform(
    platform: 'twitter' | 'facebook' | 'linkedin' | 'email',
    url: string,
    title?: string
  ): void {
    if (typeof window === 'undefined') return;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || '')}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title || 'Check out this article')}&body=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }
}