import { UpdateTopicInput } from '@singularity-news/shared';

export class UpdateTopicDto {
  private readonly data: UpdateTopicInput;

  constructor(input: UpdateTopicInput) {
    this.data = {
      name: input.name,
      slug: input.slug,
    };
  }

  validate(): string[] {
    const errors: string[] = [];

    // Optional field validations
    if (this.data.name !== undefined) {
      if (!this.data.name || this.data.name.trim().length === 0) {
        errors.push('Name cannot be empty if provided');
      }
      if (this.data.name && this.data.name.length > 100) {
        errors.push('Name must be less than 100 characters');
      }
    }

    if (this.data.slug !== undefined) {
      if (this.data.slug && !/^[a-z0-9-]+$/.test(this.data.slug)) {
        errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
      }
      if (this.data.slug && this.data.slug.length > 100) {
        errors.push('Slug must be less than 100 characters');
      }
    }

    // At least one field must be provided
    if (!this.data.name && !this.data.slug) {
      errors.push('At least one field must be provided for update');
    }

    return errors;
  }

  get validatedData(): UpdateTopicInput {
    return this.data;
  }

  get name() { return this.data.name; }
  get slug() { return this.data.slug; }
}