# Αμερόληπτα Νέα (Amerolipta Nea) - Development Guide

## Project Overview
A modern Greek AI-powered news website built with Next.js and Express.js, featuring server-side rendering and a classic newspaper design with contemporary functionality.

## Tech Stack
- **Frontend**: Next.js 15.5.2, React 19, TypeScript, Zustand 5.0.7, Tailwind CSS 4
- **Backend**: Express.js, TypeScript, Node.js 20
- **Database**: PostgreSQL (hosted on Railway)
- **Package Manager**: PNPM workspaces
- **Deployment**: Frontend on Vercel, Backend + DB on Railway

## Project Structure
```
singularity-news/
├── backend/          # Express.js API server
├── frontend/         # Next.js application  
├── shared/           # Shared utilities and types
├── ARCHITECTURE.md   # Detailed system architecture
└── pnpm-workspace.yaml
```

## Development Status

### Completed Steps ✅
1. **Monorepo Structure Setup** - PNPM workspace configuration
2. **Frontend Boilerplate** - Next.js 15.5.2 with App Router, Tailwind CSS
3. **Backend Boilerplate** - Express.js with TypeScript
4. **Shared Module Setup** - Common types and utilities
5. **Database Integration** - PostgreSQL with migration system
6. **Article CRUD API** - Full article management endpoints
7. **Admin UI** - Rich text editor for article creation
8. **User-Facing Pages** - Article listing and reading
9. **SEO Optimization** - Meta tags, sitemap, structured data
10. **Performance Optimization** - Server components, optimized images

### Current Focus & Upcoming Steps
1. **Authentication System** 
   - Evaluate Supabase Auth for user authentication
   - Keep articles DB on Railway, auth on Supabase (hybrid approach)
   - Implement admin panel authentication
   
2. **Article Search Functionality**
   - Full-text search implementation
   - Topic-based filtering improvements
   - Search API endpoints

3. **Media Management**
   - Image upload system
   - CDN integration for media assets
   - Image optimization pipeline

4. **Production Readiness**
   - Environment variable management
   - Error tracking (Sentry integration)
   - Performance monitoring
   - Rate limiting

5. **Documentation & Testing**
   - API documentation (OpenAPI/Swagger)
   - Unit and integration tests
   - User documentation

## Key Commands
```bash
# Workspace management
pnpm install                    # Install all workspace dependencies
pnpm -r build                   # Build all packages

# Development
pnpm --filter frontend dev      # Run frontend dev server (port 3000)
pnpm --filter backend dev       # Run backend dev server (port 3002)

# Code quality
pnpm lint                       # Lint all workspaces
pnpm lint:fix                   # Auto-fix linting issues
pnpm tsc                        # TypeScript check

# Database
pnpm --filter backend db:migrate:dev   # Run migrations locally
pnpm --filter backend db:migrate:prod  # Run migrations in production
```

## Development Rules
- Work on one feature at a time
- Verify each feature works before proceeding
- Follow existing code conventions and patterns
- Use TypeScript throughout the entire stack
- **IMPORTANT**: Update `GIT_HISTORY.md` with every commit (enforced by pre-commit hook)

## Git Commit Requirements

### 1. Never Commit Without Explicit Instruction
- **NEVER** commit changes unless explicitly instructed by the user
- Wait for clear instructions like "commit this", "commit the changes"
- The user will tell you when they want changes committed

### 2. Conventional Commits Format
- All commit messages MUST follow conventional commits format
- Format: `type(scope): subject` (scope is optional)
- Allowed types: feat, fix, docs, style, refactor, perf, test, chore, build, ci, revert
- Examples:
  - `feat: add user authentication`
  - `fix(api): resolve database timeout`
  - `docs: update README`

### 3. GIT_HISTORY.md Updates
- The GIT_HISTORY.md file MUST be updated with every commit
- Include: commit hash, type, description, detailed changes
- Never skip this step - it maintains project documentation

## Response Protocol
- **When asked a question**: Provide recommendations and explain different approaches. DO NOT start coding.
- **When given direction**: Only after explicit instruction, begin implementation.
- **Analysis first**: Always analyze and discuss options before making changes.

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (.env)
```
NODE_ENV=development
PORT=3002
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@host:port/database
# Future: SUPABASE_URL and SUPABASE_ANON_KEY for auth
```

## Important Notes
- Authentication is NOT yet implemented (Supabase Auth planned)
- Articles database stays on Railway PostgreSQL
- Redis configured for local development only
- See ARCHITECTURE.md for detailed system design