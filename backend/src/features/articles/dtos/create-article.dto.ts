import { CreateArticleInput } from '@singularity-news/shared';

export class CreateArticleDto {
  private readonly data: CreateArticleInput;

  constructor(input: Partial<CreateArticleInput> & { title: string; content: string; topic: string }) {
    this.data = {
      title: input.title,
      content: input.content,
      topic: input.topic,
      slug: input.slug,
      summary: input.summary,
      coverPhoto: input.coverPhoto,
      tags: input.tags || [],
      publishedDate: input.publishedDate,
      published: input.published ?? true,
    };
  }

  validate(): string[] {
    const errors: string[] = [];

    // Required fields
    if (!this.data.title || this.data.title.trim().length === 0) {
      errors.push('Title is required');
    }
    if (this.data.title && this.data.title.length > 500) {
      errors.push('Title must be less than 500 characters');
    }

    if (!this.data.content || this.data.content.trim().length === 0) {
      errors.push('Content is required');
    }

    if (!this.data.topic || this.data.topic.trim().length === 0) {
      errors.push('Topic is required');
    }

    // Optional field validations
    if (this.data.slug && !/^[a-z0-9-]+$/.test(this.data.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    if (this.data.tags && !Array.isArray(this.data.tags)) {
      errors.push('Tags must be an array');
    }

    if (this.data.publishedDate && this.data.publishedDate && isNaN(Date.parse(this.data.publishedDate))) {
      errors.push('Published date must be a valid date');
    }

    return errors;
  }

  // Expose the validated data
  get validatedData(): CreateArticleInput {
    return this.data;
  }

  // Convenience getters for individual properties
  get title() { return this.data.title; }
  get content() { return this.data.content; }
  get topic() { return this.data.topic; }
  get slug() { return this.data.slug; }
  get summary() { return this.data.summary; }
  get coverPhoto() { return this.data.coverPhoto; }
  get tags() { return this.data.tags; }
  get publishedDate() { return this.data.publishedDate; }
  get published() { return this.data.published; }
}