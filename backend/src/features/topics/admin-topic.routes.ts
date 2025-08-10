import { Router } from 'express';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';

// Dependency injection
const repository = new TopicRepository();
const service = new TopicService(repository);
const controller = new TopicController(service);

// Bind controller methods to preserve 'this' context
const boundController = {
  getAllTopics: controller.getAllTopics.bind(controller),
  getTopicById: controller.getTopicById.bind(controller),
  createTopic: controller.createTopic.bind(controller),
  updateTopic: controller.updateTopic.bind(controller),
  deleteTopic: controller.deleteTopic.bind(controller),
};

// Create router with admin topic routes
export const AdminTopicRoutes: Router = Router();

AdminTopicRoutes.get('/', boundController.getAllTopics);
AdminTopicRoutes.get('/:id', boundController.getTopicById);
AdminTopicRoutes.post('/', boundController.createTopic);
AdminTopicRoutes.put('/:id', boundController.updateTopic);
AdminTopicRoutes.delete('/:id', boundController.deleteTopic);