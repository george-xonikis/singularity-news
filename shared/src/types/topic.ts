export interface Topic {
  id: string;
  name: string;
  slug: string;
}

// CreateTopicInput: User-provided fields for creating a topic
export type CreateTopicInput = Pick<Topic, 'name'> & {
  slug?: string | undefined; // Optional, can be auto-generated from name
};

// UpdateTopicInput: Make all user-editable fields optional
export type UpdateTopicInput = Partial<Pick<Topic, 'name' | 'slug'>>;