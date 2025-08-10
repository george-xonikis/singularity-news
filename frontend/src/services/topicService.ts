import type { Topic } from '@singularity-news/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export class TopicService {
  private static handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  };

  /**
   * Fetch all topics
   */
  static async getTopics(): Promise<Topic[]> {
    const response = await fetch(`${API_BASE_URL}/topics`);
    return this.handleResponse<Topic[]>(response);
  }
}