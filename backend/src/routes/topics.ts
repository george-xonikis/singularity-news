import express, { Router } from 'express';
import { TopicService } from '../services/topicService';
import { CreateTopicRequest } from '../types/database';

const router: Router = express.Router();
const topicService = new TopicService();

// GET /api/topics - Get all topics
router.get('/', async (req, res) => {
  try {
    const topics = await topicService.getAllTopics();
    res.json(topics);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch topics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/topics/:id - Get topic by ID
router.get('/:id', async (req, res) => {
  try {
    const topic = await topicService.getTopicById(req.params.id);
    
    if (!topic) {
      res.status(404).json({
        error: 'Topic not found'
      });
      return;
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch topic',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/topics/slug/:slug - Get topic by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const topic = await topicService.getTopicBySlug(req.params.slug);
    
    if (!topic) {
      res.status(404).json({
        error: 'Topic not found'
      });
      return;
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch topic',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/topics - Create new topic
router.post('/', async (req, res) => {
  try {
    const topicData: CreateTopicRequest = req.body;
    
    // Basic validation
    if (!topicData.name || !topicData.slug) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Name and slug are required'
      });
      return;
    }

    const topic = await topicService.createTopic(topicData);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create topic',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/topics/:id - Delete topic
router.delete('/:id', async (req, res) => {
  try {
    await topicService.deleteTopic(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete topic',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;