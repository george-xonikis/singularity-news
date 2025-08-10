import { Router } from 'express';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';

export const createTopicRoutes = (): Router => {
  const router = Router();
  
  // Dependency injection
  const topicRepository = new TopicRepository();
  const topicService = new TopicService(topicRepository);
  const topicController = new TopicController(topicService);

  // Routes
  router.get('/', topicController.getAllTopics);
  router.get('/:id', topicController.getTopicById);
  router.get('/slug/:slug', topicController.getTopicBySlug);
  router.post('/', topicController.createTopic);
  router.put('/:id', topicController.updateTopic);
  router.delete('/:id', topicController.deleteTopic);

  return router;
};