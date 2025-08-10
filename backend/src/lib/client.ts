// Database client that works with both Docker PostgreSQL and Supabase
import { createClient } from '@supabase/supabase-js';
import { query } from '../shared/database/connection';

// Check if we're using Supabase or direct PostgreSQL
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase client (for production)
export const supabase = useSupabase 
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

// Database abstraction layer
export const db = {
  async query(text: string, params?: any[]) {
    if (useSupabase) {
      // Convert SQL to Supabase query (would need proper implementation)
      throw new Error('Direct SQL queries not supported with Supabase client');
    } else {
      // Use direct PostgreSQL connection
      return query(text, params);
    }
  },

  // Table-specific methods that work with both
  articles: {
    async findAll() {
      if (useSupabase) {
        const { data, error } = await supabase!
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { rows: data };
      } else {
        return query('SELECT * FROM articles WHERE published = TRUE ORDER BY created_at DESC');
      }
    },

    async findById(id: string) {
      if (useSupabase) {
        const { data, error } = await supabase!
          .from('articles')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single();
        
        if (error) throw error;
        return { rows: data ? [data] : [] };
      } else {
        return query('SELECT * FROM articles WHERE id = $1 AND published = TRUE', [id]);
      }
    }
  },

  topics: {
    async findAll() {
      if (useSupabase) {
        const { data, error } = await supabase!
          .from('topics')
          .select('*')
          .order('name');
        
        if (error) throw error;
        return { rows: data };
      } else {
        return query('SELECT * FROM topics ORDER BY name');
      }
    }
  }
};