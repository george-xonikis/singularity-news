# Αμερόληπτα Νέα (Amerolipta Nea) - System Architecture

## Project Overview
A modern Greek AI-powered news website built with a monorepo architecture, featuring server-side rendering, real-time updates, and a classic newspaper design with contemporary functionality.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5.x
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 5.0.7
- **Reactive Programming**: RxJS 7.8.2
- **Icons**: Heroicons React 2.2.0
- **Rich Text Editor**: React Quill 3.6.0
- **Deployment**: Vercel

### Backend
- **Framework**: Express.js 4.21.2
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL (via pg 8.16.3)
- **Authentication**: Supabase Auth
- **Deployment**: Railway
- **Health Checks**: Built-in /health endpoint

### Database
- **Primary**: PostgreSQL (deployed on Railway)
- **Connection**: Direct pg client
- **Migrations**: Custom SQL-based migration system
- **Schema Management**: database/run-migrations.sql

### Shared
- **Common Types**: @singularity-news/shared workspace
- **TypeScript Interfaces**: Article, Topic, User types
- **Utilities**: Shared validation and helper functions

## Infrastructure

### Deployment Architecture
```
┌─────────────────────────────────────────────────────┐
│                     Vercel CDN                       │
│                   (Frontend - SSR)                   │
│            https://amerolipta-nea.vercel.app        │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ API Calls
                      │
┌─────────────────────▼───────────────────────────────┐
│                    Railway                          │
│               Backend Express API                    │
│            https://api.railway.app                  │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ Database Connection
                      │
┌─────────────────────▼───────────────────────────────┐
│                    Railway                          │
│               PostgreSQL Database                    │
│              (Production Database)                   │
└─────────────────────────────────────────────────────┘
```

### Local Development
```
┌──────────────────────────────────────────────────────┐
│              Local Development Environment           │
├───────────────────────────────────────────────────────┤
│ Frontend (Next.js)  │ http://localhost:3000          │
│ Backend (Express)   │ http://localhost:3002          │
│ PostgreSQL (Docker) │ localhost:5433                 │
│ Redis (Docker)      │ localhost:6380                 │
└───────────────────────────────────────────────────────┘
```

## Project Structure
```
singularity-news/
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── (public)/  # Public routes
│   │   │   └── admin/     # Admin routes
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and server data
│   │   ├── services/     # API services
│   │   └── stores/       # Zustand stores
│   └── public/           # Static assets
│
├── backend/               # Express.js API
│   ├── src/
│   │   ├── config/       # Environment config
│   │   ├── features/     # Feature modules
│   │   │   ├── articles/ # Article CRUD
│   │   │   └── topics/   # Topic management
│   │   ├── routes/       # API routes
│   │   └── shared/       # Middleware & utilities
│   └── database/         # SQL migrations & schema
│
├── shared/                # Shared types & utilities
│   └── src/
│       ├── types/        # TypeScript interfaces
│       └── utils/        # Common utilities
│
├── railway.json          # Railway deployment config
├── vercel.json          # Vercel deployment config
├── docker-compose.yml   # Local dev services
└── pnpm-workspace.yaml  # Monorepo configuration
```

## Key Features

### Frontend Features
- **Server-Side Rendering (SSR)**: Fast initial page loads with Next.js App Router
- **SEO Optimized**: Meta tags, OpenGraph, Twitter Cards, JSON-LD structured data
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Article Management**: Rich text editor for admin panel
- **Topic Navigation**: Dynamic topic-based filtering
- **Performance Optimized**: 
  - Lazy loading images
  - Server components where possible
  - Optimized bundle splitting
  - LCP < 0.7s on article pages

### Backend Features
- **RESTful API**: Clean REST endpoints
- **Database Migrations**: Automated migration system
- **Health Monitoring**: /health endpoint for uptime checks
- **CORS Configuration**: Configurable origins for production
- **Error Handling**: Centralized error middleware
- **Request Logging**: Built-in request/response logging

### Database Schema
- **articles**: Main content storage with UUID[] topics
- **topics**: Category management with slugs
- **migrations**: Track applied database migrations
- **users**: Authentication and authorization (via Supabase)

## Development Workflow

### Commands
```bash
# Install dependencies
pnpm install

# Development
pnpm --filter frontend dev      # Frontend on :3000
pnpm --filter backend dev       # Backend on :3002

# Build
pnpm --filter shared build      # Build shared types
pnpm --filter frontend build    # Build frontend
pnpm --filter backend build     # Build backend

# Linting & Testing
pnpm lint                       # Lint all workspaces
pnpm lint:fix                  # Fix linting issues
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Backend (.env)
```
NODE_ENV=development
PORT=3002
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost:5433/singularity_news
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## Deployment

### Frontend (Vercel)
- Automatic deployments from main branch
- Environment variables set in Vercel dashboard
- Build command: `pnpm --filter shared build && pnpm --filter frontend build:vercel`

### Backend (Railway)
- Deployed via railway.json configuration
- PostgreSQL database on same Railway project
- Start command: `pnpm --filter backend build:prod && pnpm --filter backend start:prod`
- Automatic migrations on deploy

## Questions/Clarifications Needed

1. **Authentication Flow**: Is Supabase Auth fully integrated or still in progress?
2. **Redis Cache**: Is Redis being used in production or just local development?
3. **Admin Panel**: What's the authentication mechanism for admin routes?
4. **API Documentation**: Is there OpenAPI/Swagger documentation?
5. **Monitoring**: What monitoring/logging services are in use (Sentry, LogRocket, etc.)?
6. **CDN/Media Storage**: Where are article images stored? Supabase Storage or elsewhere?

## Recent Updates
- Rebranded from "Singularity News" to "Αμερόληπτα Νέα" (Amerolipta Nea)
- Performance optimizations: Split ArticleDetail into server/client components
- Created unified ArticleSummary component for consistency
- SEO improvements with comprehensive meta tags and structured data