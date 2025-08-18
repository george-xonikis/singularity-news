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

TopicRoutes.get('/', (req, res) => topicController.getAllTopics(req, res));
TopicRoutes.get('/:id', (req, res) => topicController.getTopicById(req, res));
TopicRoutes.get('/slug/:slug', (req, res) => topicController.getTopicBySlug(req, res));