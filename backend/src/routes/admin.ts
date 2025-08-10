import { Router } from 'express';
import { query } from '../shared/database/connection';
import { transformArticleFromDb } from '../features/articles/article.mapper';
import { TopicService } from '../services/topicService';

const router: Router = Router();
const topicService = new TopicService();

// Admin Articles - Get all articles (including unpublished) with pagination and filters
router.get('/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = (page - 1) * limit;
    
    const topic = req.query.topic as string;
    const published = req.query.published as string;
    const sortBy = req.query.sortBy as string || 'created_at';
    const sortOrder = req.query.sortOrder as string || 'DESC';
    const search = req.query.search as string;

    // Build dynamic query
    let queryText = 'SELECT * FROM articles WHERE 1=1';
    let countText = 'SELECT COUNT(*) FROM articles WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 1;

    // Add filters
    if (topic) {
      queryText += ` AND topic = $${paramCount}`;
      countText += ` AND topic = $${paramCount}`;
      queryParams.push(topic);
      paramCount++;
    }

    if (published !== undefined && published !== '') {
      queryText += ` AND published = $${paramCount}`;
      countText += ` AND published = $${paramCount}`;
      queryParams.push(published === 'true');
      paramCount++;
    }

    if (search) {
      queryText += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
      countText += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Add sorting
    const allowedSortFields = ['title', 'created_at', 'updated_at', 'published_date', 'views', 'topic'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    
    queryText += ` ORDER BY ${validSortBy} ${validSortOrder}`;

    // Add pagination
    queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    // Execute queries
    const [articlesResult, countResult] = await Promise.all([
      query(queryText, queryParams),
      query(countText, queryParams.slice(0, -2)) // Remove limit/offset for count
    ]);

    const articles = articlesResult.rows.map((row: any) => transformArticleFromDb(row));
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Admin get articles error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Admin - Get single article by ID (including unpublished)
router.get('/articles/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM articles WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const article = transformArticleFromDb(result.rows[0]);
    res.json(article);
  } catch (error) {
    console.error('Admin get article error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Admin - Create new article
router.post('/articles', async (req, res) => {
  try {
    // Create article directly
    const { title, content, topic, summary, coverPhoto, tags, publishedDate, published } = req.body;
    const result = await query(
      `INSERT INTO articles (title, content, topic, summary, cover_photo, tags, published_date, published, views) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0) 
       RETURNING *`,
      [
        title,
        content, 
        topic,
        summary || null,
        coverPhoto || null,
        tags || [],
        publishedDate ? new Date(publishedDate) : new Date(),
        published ?? true
      ]
    );
    const article = transformArticleFromDb(result.rows[0]);
    res.status(201).json(article);
  } catch (error) {
    console.error('Admin create article error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Admin - Update article
router.put('/articles/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    // Update article directly
    const updates = req.body;
    const fields: string[] = [];
    const values: (string | number | boolean | string[] | Date | null)[] = [];
    let paramCount = 1;

    // Build dynamic UPDATE query
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        const dbField = key === 'coverPhoto' ? 'cover_photo' : 
                       key === 'publishedDate' ? 'published_date' : key;
        fields.push(`${dbField} = $${paramCount++}`);
        values.push(value as string | number | boolean | string[] | Date | null);
      }
    });

    if (fields.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    values.push(id);
    const sql = `
      UPDATE articles 
      SET ${fields.join(', ')}, updated_at = NOW() 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await query(sql, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    
    const article = transformArticleFromDb(result.rows[0]);
    
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json(article);
  } catch (error) {
    console.error('Admin update article error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Admin - Delete article
router.delete('/articles/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    // Soft delete article by setting published = false
    const result = await query(
      'UPDATE articles SET published = FALSE WHERE id = $1 RETURNING id',
      [id]
    );
    const success = result.rows.length > 0;
    
    if (!success) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Admin delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Admin - Get all topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await topicService.getAllTopics();
    res.json(topics);
  } catch (error) {
    console.error('Admin get topics error:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

export default router;