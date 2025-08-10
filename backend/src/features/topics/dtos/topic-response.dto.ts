import { Topic } from '@singularity-news/shared';

export class TopicResponseDto {
  id: string;
  name: string;
  slug: string;

  constructor(topic: Topic) {
    this.id = topic.id;
    this.name = topic.name;
    this.slug = topic.slug;
  }

  static fromTopic(topic: Topic): TopicResponseDto {
    return new TopicResponseDto(topic);
  }

  static fromTopics(topics: Topic[]): TopicResponseDto[] {
    return topics.map(topic => new TopicResponseDto(topic));
  }
}