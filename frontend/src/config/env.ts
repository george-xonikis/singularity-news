/**
 * Environment configuration for the frontend application
 * Centralizes all environment variable access and provides type safety
 */

export const SITE_URL = 'https://www.amerolipta-nea.gr/';

// API Configuration
export const API_CONFIG = {
  SERVER_URL: process.env.SERVER_API_URL || 'http://localhost:3002/api',
  NEXT_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
} as const;

// App Configuration
export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;