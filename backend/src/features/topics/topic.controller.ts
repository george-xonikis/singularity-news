import { Request, Response } from 'express';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dtos/create-topic.dto';
import { UpdateTopicDto } from './dtos/update-topic.dto';
import { TopicResponseDto } from './dtos/topic-response.dto';

export class TopicController {
  private topicService: TopicService;

  constructor(topicService: TopicService) {
    this.topicService = topicService;
  }

  getAllTopics = async (req: Request, res: Response): Promise<void> => {
    try {
      const topics = await this.topicService.getAllTopics();
      const response = TopicResponseDto.fromTopics(topics);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch topics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getTopicById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
      }
      const topic = await this.topicService.getTopicById(id);
      
      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }

      const response = TopicResponseDto.fromTopic(topic);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getTopicBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      if (!slug) {
        res.status(400).json({ error: 'Slug parameter is required' });
        return;
      }
      const topic = await this.topicService.getTopicBySlug(slug);
      
      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }

      const response = TopicResponseDto.fromTopic(topic);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  createTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = new CreateTopicDto(req.body);
      const validationErrors = dto.validate();
      
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          messages: validationErrors
        });
        return;
      }

      const topic = await this.topicService.createTopic(dto.validatedData);
      const response = TopicResponseDto.fromTopic(topic);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to create topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  updateTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
      }
      const dto = new UpdateTopicDto(req.body);
      const validationErrors = dto.validate();
      
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          messages: validationErrors
        });
        return;
      }

      const topic = await this.topicService.updateTopic(id, dto.validatedData);
      
      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }

      const response = TopicResponseDto.fromTopic(topic);
      res.json(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to update topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  deleteTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
      }
      await this.topicService.deleteTopic(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Topic not found') {
        res.status(404).json({ error: error.message });
        return;
      }

      if (error instanceof Error && error.message.includes('Cannot delete topic')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to delete topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}