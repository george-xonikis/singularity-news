/**
 * Environment configuration for the backend application
 * Centralizes all environment variable access and provides type safety
 */

// Server Configuration
export const SERVER_CONFIG = {
  PORT: parseInt(process.env.PORT ?? '3002', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  HOST: process.env.DB_HOST ?? 'localhost',
  PORT: parseInt(process.env.DB_PORT ?? '5433', 10),
  NAME: process.env.DB_NAME ?? 'singularity_news',
  USER: process.env.DB_USER ?? 'postgres',
  PASSWORD: process.env.DB_PASSWORD ?? 'dev_password_123',
  MAX_CONNECTIONS: 20,
  IDLE_TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 2000,
} as const;

export const FRONTEND_URL = process.env.FRONTEND_URL;

// CORS Configuration
export const CORS_CONFIG = {
  ALLOWED_ORIGINS: [
    FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001', 
  ].filter((origin): origin is string => Boolean(origin)),
} as const;

// Export individual values for convenience
export const PORT = SERVER_CONFIG.PORT;
export const IS_PRODUCTION = SERVER_CONFIG.IS_PRODUCTION;
export const IS_DEVELOPMENT = SERVER_CONFIG.IS_DEVELOPMENT;
