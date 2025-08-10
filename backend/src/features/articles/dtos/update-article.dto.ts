import { UpdateArticleInput } from '@singularity-news/shared';

export class UpdateArticleDto {
  private readonly data: UpdateArticleInput;

  constructor(input: UpdateArticleInput) {
    this.data = { ...input };
  }

  validate(): string[] {
    const errors: string[] = [];

    // Validate only if fields are provided
    if (this.data.title !== undefined) {
      if (this.data.title.trim().length === 0) {
        errors.push('Title cannot be empty');
      }
      if (this.data.title.length > 500) {
        errors.push('Title must be less than 500 characters');
      }
    }

    if (this.data.content !== undefined && this.data.content.trim().length === 0) {
      errors.push('Content cannot be empty');
    }

    if (this.data.topic !== undefined && this.data.topic.trim().length === 0) {
      errors.push('Topic cannot be empty');
    }

    if (this.data.slug !== undefined && !/^[a-z0-9-]+$/.test(this.data.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    if (this.data.tags !== undefined && !Array.isArray(this.data.tags)) {
      errors.push('Tags must be an array');
    }

    if (this.data.publishedDate !== undefined && this.data.publishedDate && isNaN(Date.parse(this.data.publishedDate))) {
      errors.push('Published date must be a valid date');
    }

    return errors;
  }

  // Expose the validated data
  get validatedData(): UpdateArticleInput {
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