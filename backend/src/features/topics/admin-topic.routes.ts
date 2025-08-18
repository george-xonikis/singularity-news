import { Router } from 'express';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';

// Dependency injection
const repository = new TopicRepository();
const service = new TopicService(repository);
const controller = new TopicController(service);

// Create router with admin topic routes
export const AdminTopicRoutes: Router = Router();

AdminTopicRoutes.get('/', (req, res) => controller.getAllTopics(req, res));
AdminTopicRoutes.get('/:id', (req, res) => controller.getTopicById(req, res));
AdminTopicRoutes.post('/', (req, res) => controller.createTopic(req, res));
AdminTopicRoutes.put('/:id', (req, res) => controller.updateTopic(req, res));
AdminTopicRoutes.delete('/:id', (req, res) => controller.deleteTopic(req, res));