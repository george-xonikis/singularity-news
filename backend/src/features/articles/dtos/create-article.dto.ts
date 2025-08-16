import { CreateArticleInput } from '@singularity-news/shared';

export class CreateArticleDto {
  private readonly data: CreateArticleInput;

  constructor(input: Partial<CreateArticleInput> & { title: string; content: string; topic: string }) {
    this.data = {
      title: input.title,
      content: input.content,
      topic: input.topic,
      tags: input.tags || [],
      published: input.published ?? true,
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.summary !== undefined && { summary: input.summary }),
      ...(input.author !== undefined && { author: input.author }),
      ...(input.coverPhoto !== undefined && { coverPhoto: input.coverPhoto }),
      ...(input.coverPhotoCaption !== undefined && { coverPhotoCaption: input.coverPhotoCaption }),
      ...(input.publishedDate !== undefined && { publishedDate: input.publishedDate }),
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

    if (!this.data.summary || this.data.summary.trim().length === 0) {
      errors.push('Summary is required');
    }

    if (!this.data.author || this.data.author.trim().length === 0) {
      errors.push('Author is required');
    }

    if (!this.data.coverPhoto || this.data.coverPhoto.trim().length === 0) {
      errors.push('Cover photo is required');
    }

    if (!this.data.coverPhotoCaption || this.data.coverPhotoCaption.trim().length === 0) {
      errors.push('Cover photo caption is required');
    }

    if (!this.data.tags || this.data.tags.length === 0) {
      errors.push('At least one tag is required');
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
  get author() { return this.data.author; }
  get coverPhoto() { return this.data.coverPhoto; }
  get coverPhotoCaption() { return this.data.coverPhotoCaption; }
  get tags() { return this.data.tags; }
  get publishedDate() { return this.data.publishedDate; }
  get published() { return this.data.published; }
}