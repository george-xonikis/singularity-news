# AI News Website - Claude Context

## Project Overview
A modern AI news website built with Next.js, Express.js, and Firebase/Firestore featuring a classic newspaper design with contemporary functionality.

## Tech Stack
- **Frontend**: Next.js 15.4.5, React 19, TypeScript, Zustand 5.0.7, Tailwind CSS 4.1.11
- **Backend**: Express.js, TypeScript, Node.js 20
- **Database/Storage**: Firebase (Firestore, Storage)
- **Package Manager**: PNPM workspaces
- **Deployment**: Docker

## Project Structure
```
singularity-news/
├── backend/          # Express.js API server
├── frontend/         # Next.js application  
├── shared/           # Shared utilities and types
├── README.md         # Project documentation
├── UI-Template.png   # Design reference
└── pnpm-workspace.yaml
```

## Development Workflow
Working through 12 sequential development steps as outlined in README.md:

### Current Status: Step 1 - Monorepo Structure Setup
**Goal**: Scaffold monorepo with backend, frontend, and shared directories
**Acceptance Criteria**:
- [ ] Monorepo created via pnpm workspace
- [ ] Separated backend/, frontend/, shared/ directories with README.md files
- [ ] Repository bootstrapped with version control

### Upcoming Steps:
1. ✅ **Step 1**: Monorepo Structure Setup
2. **Step 2**: Frontend Boilerplate & Architecture Setup (Next.js 15.4.5, Tailwind, Zustand)
3. **Step 3**: Backend Boilerplate (Express.js + Firebase Admin SDK)
4. **Step 4**: Shared Module Setup (TypeScript interfaces, utilities)
5. **Step 5**: Authentication Foundation (Firebase Auth)
6. **Step 6**: Firestore & Storage Integration
7. **Step 7**: Article CRUD API & Admin UI
8. **Step 8**: User-Facing Article Listing and Reading
9. **Step 9**: Article Search Functionality
10. **Step 10**: SEO Optimisation
11. **Step 11**: Dockerisation & Deployment
12. **Step 12**: Quality Assurance & Documentation

## Key Commands
```bash
# Workspace management
pnpm install                    # Install all workspace dependencies
pnpm -r build                   # Build all packages
pnpm -r dev                     # Run all packages in dev mode

# Code quality (unified across all workspaces)
pnpm lint                       # Lint all workspaces (FE, BE, shared)
pnpm lint:fix                   # Auto-fix linting issues across all workspaces
pnpm tsc                        # TypeScript check across all workspaces

# Frontend specific
pnpm --filter frontend dev      # Run frontend dev server
pnpm --filter frontend build    # Build frontend
pnpm --filter frontend lint     # Lint frontend code

# Backend specific  
pnpm --filter backend dev       # Run backend dev server
pnpm --filter backend build     # Build backend
pnpm --filter backend start     # Start production backend
```

## Architecture Notes
- **Frontend**: Layered architecture with API client, data layer, and Zustand state management
- **Backend**: RESTful API with Firebase Admin SDK for database operations
- **Shared**: Common TypeScript interfaces and utilities
- **Database**: Firestore for articles, users, topics; Firebase Storage for media

## Code Quality
- TypeScript with strict type checking
- ESLint with Next.js recommended rules
- Prettier for code formatting
- No comments unless explicitly requested

## Key Features to Implement
- Modern newspaper-style responsive design
- Secure admin authentication and article management
- Category-based navigation and search
- SEO optimization with SSR/SSG
- Image upload and management via Firebase Storage

## Development Rules
- Work on one step at a time
- Verify each step works before proceeding
- Pause for review and confirmation at each checkpoint
- Follow existing code conventions and patterns
- Use TypeScript throughout the entire stack
- **IMPORTANT**: Update `GIT_HISTORY.md` with every commit (required)

## Response Protocol
- **When asked a question**: Provide recommendations and explain different approaches. DO NOT start coding.
- **When given direction**: Only after explicit instruction on which approach to use, begin implementation.
- **Analysis first**: Always analyze and discuss options before making changes.
- Example:
  - User: "How should I handle loading states?"
  - Assistant: Provides 3-4 approaches with pros/cons
  - User: "Use approach 2"
  - Assistant: Now implements the chosen approach

## Git Commit Requirements
**CRITICAL**: Three mandatory requirements for all commits:

### 1. Never Commit Without Explicit Instruction
- **NEVER** commit changes unless explicitly instructed by the user
- Wait for clear instructions like "commit this", "commit the changes", or "create a commit"
- Only push to remote when specifically asked
- The user will tell you when they want changes committed and pushed

### 2. Conventional Commits Format
- All commit messages MUST follow conventional commits format
- Format: `type(scope): subject` (scope is optional)
- Allowed types: feat, fix, docs, style, refactor, perf, test, chore, build, ci, revert
- Examples:
  - `feat: add user authentication`
  - `fix(api): resolve database timeout`
  - `docs: update README with examples`
- Enforced by commit-msg hook

### 3. GIT_HISTORY.md Updates
- The GIT_HISTORY.md file MUST be updated with every commit
- After creating a commit, immediately update with:
  - Commit hash (short form)
  - Commit type and description
  - Detailed bullet points of changes
  - Update statistics section if needed
- Enforced by pre-commit hook
- Never skip this step - it maintains project documentation