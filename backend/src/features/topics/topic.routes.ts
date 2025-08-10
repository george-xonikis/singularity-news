import { Router } from 'express';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';

// Dependency injection
const topicRepository = new TopicRepository();
const topicService = new TopicService(topicRepository);
const topicController = new TopicController(topicService);

// Create router with public topic routes
export const TopicRoutes: Router = Router();

TopicRoutes.get('/', topicController.getAllTopics);
TopicRoutes.get('/:id', topicController.getTopicById);
TopicRoutes.get('/slug/:slug', topicController.getTopicBySlug);