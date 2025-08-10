import { Topic, CreateTopicInput, UpdateTopicInput } from '@singularity-news/shared';
import { TopicRepository } from './topic.repository';

export class TopicService {
  private topicRepository: TopicRepository;

  constructor(topicRepository: TopicRepository) {
    this.topicRepository = topicRepository;
  }

  async getAllTopics(): Promise<Topic[]> {
    return this.topicRepository.findAll();
  }

  async getTopicById(id: string): Promise<Topic | null> {
    return this.topicRepository.findById(id);
  }

  async getTopicBySlug(slug: string): Promise<Topic | null> {
    return this.topicRepository.findBySlug(slug);
  }

  async createTopic(input: CreateTopicInput): Promise<Topic> {
    // Check if topic name already exists
    const existingTopic = await this.topicRepository.findByName(input.name);
    if (existingTopic) {
      throw new Error(`Topic with name '${input.name}' already exists`);
    }

    // Generate slug if not provided
    const slug = input.slug || this.generateSlug(input.name);

    // Check if slug already exists
    const existingSlug = await this.topicRepository.findBySlug(slug);
    if (existingSlug) {
      throw new Error(`Topic with slug '${slug}' already exists`);
    }

    return this.topicRepository.create({
      name: input.name,
      slug: slug,
    });
  }

  async updateTopic(id: string, input: UpdateTopicInput): Promise<Topic | null> {
    // Check if topic exists
    const existingTopic = await this.topicRepository.findById(id);
    if (!existingTopic) {
      return null;
    }

    // Check name uniqueness if being updated
    if (input.name && input.name !== existingTopic.name) {
      const nameExists = await this.topicRepository.findByName(input.name);
      if (nameExists) {
        throw new Error(`Topic with name '${input.name}' already exists`);
      }
    }

    // Check slug uniqueness if being updated
    if (input.slug && input.slug !== existingTopic.slug) {
      const slugExists = await this.topicRepository.findBySlug(input.slug);
      if (slugExists) {
        throw new Error(`Topic with slug '${input.slug}' already exists`);
      }
    }

    // Filter out undefined values for database update
    const updateData: Partial<{ name: string; slug: string }> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.slug !== undefined) updateData.slug = input.slug;

    return this.topicRepository.update(id, updateData);
  }

  async deleteTopic(id: string): Promise<boolean> {
    // Check if topic exists
    const existingTopic = await this.topicRepository.findById(id);
    if (!existingTopic) {
      throw new Error('Topic not found');
    }

    // Check if topic has associated articles
    const hasArticles = await this.topicRepository.hasArticles(existingTopic.name);
    if (hasArticles) {
      throw new Error('Cannot delete topic that has associated articles');
    }

    return this.topicRepository.delete(id);
  }

  async getTopicCount(): Promise<number> {
    return this.topicRepository.count();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}