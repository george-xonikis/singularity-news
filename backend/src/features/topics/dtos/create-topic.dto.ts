import { CreateTopicInput } from '@singularity-news/shared';

export class CreateTopicDto {
  private readonly data: CreateTopicInput;

  constructor(input: Partial<CreateTopicInput> & { name: string }) {
    this.data = {
      name: input.name,
      slug: input.slug,
    };
  }

  validate(): string[] {
    const errors: string[] = [];

    // Required fields
    if (!this.data.name || this.data.name.trim().length === 0) {
      errors.push('Name is required');
    }
    if (this.data.name && this.data.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    // Optional field validations
    if (this.data.slug && !/^[a-z0-9-]+$/.test(this.data.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    if (this.data.slug && this.data.slug.length > 100) {
      errors.push('Slug must be less than 100 characters');
    }

    return errors;
  }

  // Expose the validated data
  get validatedData(): CreateTopicInput {
    return this.data;
  }

  // Convenience getters
  get name() { return this.data.name; }
  get slug() { return this.data.slug; }
}