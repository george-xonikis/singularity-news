import { Topic } from '@singularity-news/shared';

/**
 * Database representation of a topic
 */
export interface DatabaseTopic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

/**
 * Transform database topic to domain topic
 */
export const transformTopicFromDb = (dbTopic: DatabaseTopic): Topic => ({
  id: dbTopic.id,
  name: dbTopic.name,
  slug: dbTopic.slug,
});

/**
 * Transform domain topic to database format
 */
export const transformTopicToDb = (topic: Partial<Topic>): Partial<DatabaseTopic> => {
  const result: Partial<DatabaseTopic> = {};

  if (topic.id) result.id = topic.id;
  if (topic.name) result.name = topic.name;
  if (topic.slug) result.slug = topic.slug;

  return result;
};