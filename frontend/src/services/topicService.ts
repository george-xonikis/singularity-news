import type { Topic, CreateTopicInput, UpdateTopicInput } from '@singularity-news/shared';
import { NEXT_PUBLIC_BE_API_URL } from '@/config/env';

const API_BASE_URL = NEXT_PUBLIC_BE_API_URL;

export class TopicService {
  private static handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content or empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
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

  /**
   * Fetch a single topic by ID
   */
  static async getTopicById(id: string): Promise<Topic> {
    const response = await fetch(`${API_BASE_URL}/admin/topics/${id}`);
    return this.handleResponse<Topic>(response);
  }

  /**
   * Create a new topic
   */
  static async createTopic(topicInput: CreateTopicInput): Promise<Topic> {
    const response = await fetch(`${API_BASE_URL}/admin/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(topicInput),
    });
    return await this.handleResponse<Topic>(response);
  }

  /**
   * Update an existing topic
   */
  static async updateTopic(id: string, topicInput: UpdateTopicInput): Promise<Topic> {
    const response = await fetch(`${API_BASE_URL}/admin/topics/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(topicInput),
    });
    return this.handleResponse<Topic>(response);
  }

  /**
   * Delete a topic
   */
  static async deleteTopic(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/topics/${id}`, {
      method: 'DELETE',
    });
    await this.handleResponse<void>(response);
  }
}