# Git History

## Overview
This file maintains a comprehensive history of all commits in the Singularity News project. It must be updated with every new commit as part of the commit process.

## Current Branch: master
**Main Branch**: master

## Branch Structure
- **master**: Production-ready code (last commit: 85a5caa)

## Complete Commit History

### 2025-08-16

#### `pending` - **feat**: Add author field and cover photo caption to articles
- Added author field to database schema and all interfaces
  - New VARCHAR(200) column in articles table
  - Defaults to "Editorial Team" if not specified
  - Added to Article interface, DTOs, and mappers
- Added cover photo caption field for image credits/descriptions
  - New VARCHAR(500) column for photo captions
  - Displays underneath images in ArticleDetail
  - Required field in article forms
- Made all form fields required in NewArticleForm
  - Summary, author, cover photo, caption, and tags now required
  - Updated backend validation in CreateArticleDto
  - Added visual indicators (*) for required fields
- Added form validation to disable publish button when invalid
  - Created isFormValid() function to check all fields
  - Buttons disabled until all requirements met
  - Added cursor-not-allowed styling for disabled state
- Fixed cover photo upload functionality
  - Proper tab switching between URL and file upload
  - File validation for type and size (max 5MB)
  - Base64 preview for uploaded images
- Updated ArticleDetail to display actual author
  - Shows author from database or "Editorial Team" as fallback
- Added strict typing to article fetch function
  - Created ApiResponse<T> interface
  - Proper TypeScript types for SSR data fetching
- Fixed RichTextEditor dynamic import for Turbopack compatibility
  - Simplified dynamic import approach
  - Added dev:webpack script as fallback option

#### `85a5caa` - **fix**: make GIT_HISTORY.md update mandatory in pre-commit hook
- Remove interactive prompt for GIT_HISTORY.md check
- Make updating GIT_HISTORY.md a hard requirement
- Show clear error messages with instructions
- No bypass option - enforces documentation consistency

#### `2eb65e2` - **chore**: add conventional commits validation to git hooks
- Create commit-msg hook to validate conventional commit format
  - Validates format: type(scope): subject
  - Supports all conventional types (feat, fix, docs, style, refactor, etc.)
  - Interactive prompt for non-conforming messages
  - Helpful examples and explanations on failure
- Update pre-commit hook with better UI
  - Add blue color for informational messages
  - Add reminder about conventional commits
  - Better structured output with clear sections
- Improved developer experience
  - Clear error messages with examples
  - Allow bypass with confirmation for special cases
  - Support for merge commits

#### `5037eaa` - **docs**: add installation guidelines for git hooks and update documentation
- Add setup instructions for git hooks in README.md
  - Document setup-hooks.sh usage in development setup
  - Add development conventions section
  - Explain GIT_HISTORY.md requirement
- Update GIT_HISTORY.md with latest commit (76577b0)
  - Document git hooks implementation
  - Update statistics to 35 total commits
  - Update last commit reference
- Improve documentation clarity
  - Add note about optional but recommended git hooks
  - Document commit message conventions
  - Explain code quality enforcement

#### `76577b0` - **chore**: add git hooks and update GIT_HISTORY.md
- Update GIT_HISTORY.md with missing commits (736634d, e25cc88)
  - Added refactor commit for reactive topics pattern
  - Added fix commit for rich text editor issues
  - Updated statistics to reflect 34 total commits
- Create pre-commit hook to remind about GIT_HISTORY.md updates
  - Interactive prompt asks for confirmation if history not updated
  - Includes color-coded warnings for better visibility
  - Optionally runs lint:fix on commit
- Add setup-hooks.sh script for easy configuration
  - Configures git to use .githooks directory
  - Makes setup simple for other developers
- Document GIT_HISTORY.md requirement in CLAUDE.md
  - Added critical section about mandatory history updates
  - Clear instructions on what to include in updates

#### `e25cc88` - **fix**: resolve rich text editor issues with paste and height
- Fix toolbar disappearing when pasting content
  - Updated toolbar configuration to use container property
  - Added clipboard.matchVisual: false to prevent paste issues
  - Made toolbar sticky with proper z-index
- Double editor height for better content visibility
  - Increased height from 300px to 600px
  - Updated min-height for editor from 300px to 550px
  - Adjusted loading skeleton heights to match
- Additional improvements
  - Sticky toolbar stays at top when scrolling
  - White background ensures toolbar visibility
  - Proper z-index layering for toolbar
- Minor import cleanup in topics$ observable

#### `736634d` - **refactor**: cleanup stores and implement reactive topics pattern
- Remove old unused /store directory with async articleStore and topicStore
- Update topicStore to follow synchronous pattern like articleStore
  - Remove async fetchTopics method
  - Add refetchTrigger and refetch() for reactive updates
  - Keep only synchronous state management
- Create topics$ observable following articles$ pattern
  - Uses storeToObservable utility for reactive data flow
  - Handles API calls and error management in observable pipeline
  - Simplified switchMap usage without unnecessary from() operator
- Update components to use reactive topics pattern
  - AdminArticlesList subscribes to topics$ observable
  - NewArticleForm and EditArticleForm use reactive subscriptions
  - Components trigger refetch instead of calling async methods

Architecture improvements:
- Consistent reactive pattern across articles and topics
- Clean separation: Stores (sync) → Observables (async) → Services (API)
- Better error handling and stream management
- Reduced code duplication and complexity (124 lines removed)

### 2025-08-14

#### `70b6da4` - **docs**: add comprehensive Articles feature architecture documentation
Documentation:
- Created detailed architecture documentation for Articles feature
- Added visual Mermaid diagram showing component relationships
- Documented complete data flow patterns and reactive pipeline

Key Sections:
- Component layer documentation (AdminArticlesList, ArticlesTable, etc.)
- State management with Zustand stores
- Reactive layer with RxJS observables pipeline
- Service layer abstraction patterns
- Data flow diagrams for filter, delete, and CRUD operations

Architecture Highlights:
- Separation of concerns: Components → Services → Store
- Reactive pipeline: Store → Observables → API → Store updates
- Debouncing strategy (500ms) for performance
- Request cancellation via switchMap
- Error recovery keeping streams alive
- Type safety with shared types

Documentation Benefits:
- Onboarding reference for new developers
- Architecture review and planning resource
- Debugging guide for complex data flows
- Best practices and patterns reference

### 2025-08-13
#### `538614c` - **fix**: remove loading state and fix double request issue
Performance & UX Improvements:
- Removed loading state that was blocking UI during filter changes
- Fixed double API request on component mount by removing startWith()
- Cleaned up unused loading state from adminStore

Key Changes:
- Removed loading state from articles$ observable pipeline
- Removed loading/setLoading from adminStore (unused)
- Removed loading spinner from AdminArticlesList
- Fixed observable double emission caused by startWith() with initial values

Root Cause Analysis:
- startWith() was creating eager emission before store values ready
- Store would then emit actual values, causing duplicate request
- Solution: Let store be single source of truth for initial state

Benefits:
- Filters remain fully responsive while fetching
- Single API request on component mount (50% reduction)
- Cleaner code without unnecessary state management
- Better UX with non-blocking filter interactions

Also Added:
- Response protocol to CLAUDE.md for Q&A workflow
- Clear guidance on when to provide recommendations vs implementation

#### `7266c41` - **refactor**: implement clean architecture separation and refetch mechanism
Architecture Improvements:
- Separated concerns: Components → Services → Store
- Removed async operations from store (deleteArticle)
- Services handle all API calls, store only manages state
- Added refetch mechanism with trigger-based observables

Store Refactoring:
- Removed setArticles, setPagination, removeArticle, addArticle methods
- Kept only updateArticle for in-place UI updates
- Added refetchTrigger and refetch() method
- Store now only handles synchronous state updates

Component Updates:
- ArticlesTable: Calls ArticleService.deleteArticle() directly, then refetch()
- NewArticleForm: Uses ArticleService directly, no store updates
- EditArticleForm: Uses ArticleService and updates store for immediate UI feedback
- All forms now use TopicService for consistent topic fetching

Observable Enhancements:
- Added refetchTrigger$ observable to watch for manual refetch requests
- Combines filters with trigger for complete refetch control
- Maintains current filters/sorting when refetching

Benefits:
- Clear separation of concerns
- Better error handling at component level
- Improved testability
- Server as single source of truth for pagination
- Immediate UI updates with background synchronization

### 2025-08-11
#### `3faa72a` - **feat**: implement advanced article filtering and state management
- Add ArticleFilters component with status, topic, and date range filtering
- Create ArticlesTable component with pagination and sorting
- Implement observable-based state management for articles and topics
- Add custom hooks for articles management (useArticles, useArticleFilters)
- Integrate RxJS observables with Zustand stores for reactive updates
- Enhance admin UI with comprehensive filtering capabilities
- Branch: master

### 2025-08-10

#### `f331352` - **feat**: implement unified ESLint configuration with enhanced formatting rules
- Added unified linting commands at root level: `pnpm lint` and `pnpm lint:fix`
- Created ESLint configurations for backend and shared workspaces
- Enhanced frontend ESLint with strict spacing and formatting rules
- Added comprehensive spacing rules: no-multi-spaces, no-trailing-spaces, space-before-blocks
- Configured Node.js globals for backend ESLint (process, console, etc.)
- Auto-fixed all spacing issues across codebase including multiple spaces in fetch calls
- Updated CLAUDE.md with new unified linting commands
- All workspaces now have consistent code quality enforcement

#### `490704a` - **refactor**: split admin services and remove redundant naming
- Split AdminService into ArticleService and TopicService for better separation of concerns
- Renamed services to remove redundant "Admin" prefix since they're already admin-specific
- Created ArticleService with article-specific CRUD operations and filtering
- Created TopicService with topic-specific operations
- Updated adminStore to use the split services with proper type conversion
- Aligned ArticleFilters interface with backend repository
- Removed AdminArticle interface, now using Article with published boolean
- Fixed API_BASE_URL to use environment variable
- Updated AdminArticlesList component to use Article.published instead of status
- Removed debug console.log statements

#### `88a3a0d` - **refactor**: restructure routing architecture with clean separation of concerns
- Refactor all route files to use direct Router exports instead of factory functions
- Create clear separation between public and admin API endpoints
- Remove CRUD operations from public routes (security improvement)
- Implement proper feature-based controller architecture
- Fix delete functionality to use hard delete in admin context
- Consolidate route mounting through public.ts and admin.ts aggregators

#### `217e3e3` - **feat(admin)**: enhance UI/UX with improved design and interactions
- Update color scheme to indigo/purple branding throughout admin interface
- Improve table interactions with clickable rows and better cursor states
- Enhance visual hierarchy with bolder headers and refined styling
- Remove unnecessary navigation items and streamline user experience

#### `a1ab01d` - **feat(admin)**: add colored status badges to articles table
- Published articles show green background with green text
- Draft articles show yellow background with yellow text
- Use rounded pill design for clean visual hierarchy
- Improve status visibility and quick scanning

#### `2ae5ec3` - **feat(admin)**: apply clean minimal UI design to articles table
- Remove heavy shadows and borders for cleaner appearance
- Simplify header styling with consistent typography
- Use subtle row separators instead of dividers
- Remove badges/icons for cleaner text-only display
- Streamline actions to simple "Edit" text links
- Match reference design with minimal aesthetic
- Maintain all sorting and filtering functionality

#### `fdb9a7f` - **fix(admin)**: add pointer cursor to sortable column headers
- Add cursor-pointer class to SortButton component
- Improves UX by indicating clickable sort functionality
- Applied to Date, Title, Topic, and Views column headers

#### `c9d6a65` - **fix(admin)**: improve articles table column layout and text display
- Move Date column to first position for better chronological view
- Limit title and slug columns to 20 characters with ellipsis
- Add tooltip on hover to show full title/slug text
- Maintain views column sortability (already implemented)

#### `2e86e34` - **feat(admin)**: enhance articles table with comprehensive filtering and pagination
- Add enhanced AdminArticlesList with title, slug, date, topic, views columns
- Implement pagination with 20 entries default
- Add sortable columns (views, title, date, topic)
- Add comprehensive filtering: views range, date range, topic, title search
- Update backend admin API to support all filter parameters
- Improve UI with collapsible filters section and responsive design

#### `c61312a` - **fix**: make admin sidebar fill full viewport height
- Add h-screen class to AdminSidebar root div
- Ensures sidebar extends to bottom of screen
- Eliminates white space at bottom of sidebar
- Maintains existing responsive behavior and styling

#### `0b38500` - **fix**: resolve admin UI issues and enhance rich text editor
Backend Fixes:
- Fix admin API response format to include success wrapper
- Return { success: true, data: article } for create/update operations
- Resolves "Failed to create article" false negative notifications

Frontend Fixes:
- Fix Quill configuration error by removing invalid 'bullet' format
- Remove unused formats (font, size, video) from rich text editor
- Add comprehensive CSS styles for rich editor HTML content
- Fix text styling preservation in article detail view
- Add styles for headings, lists, blockquotes, alignment, and formatting

UI Enhancements:
- Make admin sidebar header clickable to navigate to /admin
- Add hover effect and smooth transitions to sidebar header
- Improve error handling in NewArticleForm and EditArticleForm
- Check response.ok before parsing JSON for better error messages

CSS Additions (globals.css):
- Complete styling for Quill-generated HTML elements
- Support for h1-h6, bold, italic, underline, strikethrough
- Proper list styling (ordered/unordered)
- Blockquote with border and italic style
- Link hover effects and image rounded corners
- Text alignment classes (center, right, justify)

#### `1e213ce` - **fix**: resolve admin article creation 500 error and enhance topic selection
Backend Fixes:
- Update admin routes to use ArticleService instead of direct SQL queries
- Fix missing slug generation causing database constraint violations
- Add proper validation using CreateArticleDto and UpdateArticleDto
- Implement comprehensive error handling with proper HTTP status codes
- Fix UpdateTopicDto constructor for exactOptionalPropertyTypes compliance

Frontend Enhancements:
- Replace react-quill with react-quill-new for React 19 compatibility
- Fix findDOMNode deprecation error preventing article creation
- Create SearchableTopicDropdown component with real-time search
- Add keyboard navigation (arrow keys, Enter, Escape) support
- Implement topic fetching from backend API (/api/topics)
- Fix type mismatches: use shared Topic interface instead of local definitions
- Apply searchable dropdown to both NewArticleForm and EditArticleForm
- Fix handleDelete parameter type (string UUID vs number)

Technical Improvements:
- Use feature-based architecture consistently across admin endpoints
- Proper dependency injection in admin routes
- Enhanced user experience with searchable topic selection
- Fix CSS import path for react-quill-new package

#### `26d8cf9` - **refactor**: migrate topics to feature-based architecture and fix type duplication
- Convert topics to feature-based architecture following articles pattern
- Add TopicRepository with parameterized SQL queries for data access
- Add TopicService with business logic (slug generation, uniqueness validation)
- Add TopicController with comprehensive HTTP error handling
- Add DTOs for request validation and response formatting
- Remove legacy routes/topics.ts and services/topicService.ts
- Update admin routes to use new TopicService with dependency injection
- Fix type duplication using TypeScript utility types

#### `aa6b120` - **feat**: refactor backend to feature-based architecture with TypeScript
- Implement feature-based architecture for articles module
- Add complete type safety with shared types integration
- Create proper DTOs with validation using shared types
- Implement repository pattern with direct SQL queries
- Add mapper layer for database ↔ domain transformations
- Create structured error handling middleware
- Update shared types to use TypeScript utility types
- Add comprehensive backend architecture documentation
- Fix all TypeScript errors with strict typing
- Remove old article service and transform utilities

Architecture improvements:
- Feature-based organization (Controller → Service → Repository)
- Direct SQL with parameterized queries (no ORM)
- Shared types from monorepo (@singularity-news/shared)
- Type-safe DTOs with validation methods
- Proper error handling with structured responses

#### `f4d3a09` - **fix**: resolve React hydration errors and ID type mismatch
- Change Article ID type from number to string (UUID)
- Remove parseInt on UUID values in dataTransform
- Fix hydration errors by removing client-side sorting
- Sort articles by views on backend for popular articles
- Update all navigation links to use Next.js Link component
- Add null checks for article content to prevent runtime errors

#### `c5b009d` - **feat**: implement article detail view and database management
- Add article detail page with slug-based routing
- Create ArticleDetail component matching UI design
- Reorganize database files (separate schema and seed)
- Add database reset command (pnpm db:reset)
- Add slug and summary fields to article schema
- Fix seed data syntax error
- Update Docker volumes for proper DB initialization

### 2025-08-09

#### `296b7f1` - **feat**: implement complete admin interface with CRUD operations
- Add comprehensive admin panel with newspaper-style design
- Implement rich text editor using React-Quill for article creation
- Create admin routes for article CRUD operations (create, read, update, delete)
- Add admin articles list with pagination, search, filtering, and sorting
- Implement new article creation and editing forms with validation
- Add admin dashboard with statistics and quick actions
- Update database schema with tags and published_date fields
- Fix TypeScript errors and improve type safety across backend
- Add object-curly-spacing ESLint rule for consistent code formatting
- Update CORS configuration to allow admin frontend access
- Add TypeScript check command (pnpm tsc) for development workflow
- Clean up unused files and resolve all compilation errors

#### `1384521` - **docs**: migrate architecture from Firebase Auth to Supabase Auth
Strategic architectural decision to unify authentication with database provider:

Architecture Changes:
- Update tech stack to use Supabase Auth instead of Firebase Auth
- Emphasize unified ecosystem: Supabase PostgreSQL + Supabase Auth
- Add dedicated Authentication & User Management architecture section
- Highlight benefits: integrated user management, JWT tokens, row-level security

Documentation Updates:
- README: Complete rewrite of Step 5 authentication approach
- README: Update admin features to reflect Supabase Auth integration
- ENV_SETUP.md: Replace Firebase config with Supabase configuration
- Step 6: Rename from "Firestore Integration" to "Database Schema & User Management"

Environment Variables:
- Frontend: Replace NEXT_PUBLIC_FIREBASE_* with NEXT_PUBLIC_SUPABASE_*
- Backend: Replace Firebase Admin SDK vars with Supabase service role keys
- Update all .env.example and .env.local files consistently

Benefits of This Change:
- Single provider ecosystem (database + auth)
- Reduced architectural complexity
- Built-in user table integration with PostgreSQL
- Seamless JWT token handling
- Enterprise-grade authentication features

#### `70cdcc9` - **refactor**: complete DataLayer cleanup and environment variables setup
Major architectural cleanup and environment configuration improvements:

DataLayer Cleanup:
- Remove obsolete frontend/src/api/dataLayer.ts (118 lines of mock data)
- Update all components to use @singularity-news/shared types
- Modernize Zustand stores to call real backend API endpoints
- Eliminate type duplication across frontend/backend

Environment Variables Setup:
- Backend now uses environment variables for database configuration
- Create frontend .env.local and .env.example with Firebase placeholders
- Add comprehensive environment documentation in ENV_SETUP.md
- Update README with proper development setup instructions
- Hide database credentials in logs for security

Shared Module Integration:
- Frontend components now import from @singularity-news/shared
- Zustand stores updated to use NEXT_PUBLIC_API_URL environment variable
- Consistent API URL configuration across SSR and client-side

Architecture Improvements:
- Clean separation between server-side and client-side API calls
- Proper environment variable loading and configuration
- Ready for Step 5: Authentication Foundation with Firebase placeholders

### 2025-08-08

#### `8dbf81b` - **feat(frontend)**: enhance ESLint configuration with comprehensive code quality rules
- Add Prettier integration for consistent code formatting
- Configure indentation rules to catch spacing issues (2-space standard)
- Add unused variables/imports detection with TypeScript support
- Include code quality rules: no-debugger, prefer-const, no-var
- Add quote style enforcement (single quotes preferred)
- Install missing eslint-plugin-react-hooks dependency at workspace root
- Add format scripts: format and format:check for Prettier automation
- Apply consistent formatting across all source files

#### `96a4783` - **refactor(frontend)**: convert to server-side rendering and cleanup unused code
- Convert main page from client component to async server component
- Remove 'use client' directive and React hooks (useEffect, store hooks)
- Add server-side data fetching functions in lib/server-data.ts
- Remove unused apiClient import from dataLayer.ts
- Preserve Zustand stores for future interactive features
- Improve SEO and initial page load performance with SSR

#### `dfb0843` - **refactor(frontend)**: extract page components into dedicated modules
Break down the large page.tsx file into reusable components:
- Header: Site title and tagline
- Navigation: Main navigation with topic links
- MainContent: Articles listing section
- Sidebar: Popular articles and topics widgets
- Footer: Footer with copyright messaging

This improves maintainability, reusability, and follows React best practices.
Reduced page.tsx from 127 to 53 lines.

#### `a2bcaf3` - **refactor(frontend)**: update footer messaging to emphasize neutrality (master branch)
- Update footer text from "contemporary functionality" to "Neutral perspective and Fact-based synthesis"
- Better reflects the site's commitment to unbiased AI news reporting
- Author: George Xonikis

#### `3064e7b` - **refactor(frontend)**: update footer messaging to emphasize neutrality (feat-001 branch)
- Update footer text from "contemporary functionality" to "Neutral perspective and Fact-based synthesis"
- Better reflects the site's commitment to unbiased AI news reporting
- Branch: feat-001

#### `eefef6a` - **feat(page)**: updated year
- Simple year update
- Branch: feat-001

### 2025-08-07

#### `38092cf` - **Initial commit**: Monorepo setup for AI news website
- Setup PNPM workspace with backend, frontend, and shared directories
- Added project documentation and development workflow
- Configured TypeScript, Next.js 15.4.5, and Express.js structure
- Established Firebase/Firestore integration foundation

## Key Milestones

### Phase 1: Foundation (2025-08-07 to 2025-08-08)
- Monorepo structure established with PNPM workspaces
- Frontend architecture set up with Next.js 15.4.5 and SSR
- ESLint and Prettier configuration for code quality
- Component extraction and modularization

### Phase 2: Backend & Data Layer (2025-08-09 to 2025-08-10)
- DataLayer cleanup and environment setup
- Migration from Firebase to Supabase Auth (documentation)
- Backend refactored to feature-based architecture
- Topics feature implemented with full CRUD
- Repository pattern with direct SQL queries
- Complete TypeScript integration

### Phase 3: Admin Interface (2025-08-10 to 2025-08-11)
- Complete admin CRUD operations for articles
- Rich text editor with React Quill
- Article management system with filtering and pagination
- UI/UX enhancements with clean minimal design
- Status badges and improved table layouts
- Searchable topic dropdown with keyboard navigation
- Admin service split for better separation of concerns

### Phase 4: State Management & Filtering (2025-08-11)
- Advanced article filtering with RxJS observables
- Zustand stores with reactive updates
- Custom hooks for articles management
- PR review fixes and text updates

## Statistics
- **Total Commits**: 38 (36 in master, 2 unique to feat-001)
- **Contributors**: georgexon, George Xonikis
- **Active Development Period**: August 7-16, 2025
- **Most Active Day**: August 10, 2025 (16 commits)

## Update Instructions
When making a new commit, update this file with:
1. Date section (create if new date)
2. Commit hash (short form)
3. Commit type (feat/fix/refactor/docs/chore)
4. Brief description in title
5. Full description bullets from commit body
6. Update current branch if changed
7. Add to milestones if significant feature completed
8. Update statistics section

## Format Template
```markdown
#### `hash` - **type(scope)**: brief description
- Detailed point 1 from commit body
- Detailed point 2 from commit body
- Technical implementation details
- Branch: branch-name (if not master)
```