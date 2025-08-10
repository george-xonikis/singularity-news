import { Topic } from '@singularity-news/shared';

interface DatabaseTopic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export const transformTopicFromDb = (dbTopic: DatabaseTopic): Topic => ({
  id: dbTopic.id,
  name: dbTopic.name,
  slug: dbTopic.slug,
});