/**
 * Environment configuration for the frontend application
 * Centralizes all environment variable access and provides type safety
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BE_API_URL || 'http://localhost:3002/api',
} as const;

// App Configuration
export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Export individual values for convenience
export const BE_API_URL = API_CONFIG.BASE_URL;
export const IS_PRODUCTION = APP_CONFIG.IS_PRODUCTION;
export const IS_DEVELOPMENT = APP_CONFIG.IS_DEVELOPMENT;