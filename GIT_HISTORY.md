# Git History

## Overview
This file maintains a comprehensive history of all commits in the Singularity News project. It must be updated with every new commit as part of the commit process.

## Current Branch: master
**Main Branch**: master

## Branch Structure
- **master**: Production-ready code (last commit: 0504172)

## Complete Commit History

### 2025-08-24

#### `b17595c` - **feat(api)**: add frontend URL to health check with proper imports
- **Environment variable improvements**:
  - Added FRONTEND_URL as direct export from env.ts for proper import structure
  - Updated server.ts imports to include FRONTEND_URL directly from config/env
  - Modified health check response to use FE_Url field with properly imported FRONTEND_URL
- **Implementation fixes**:
  - Fixes incorrect implementation that accessed FRONTEND_URL through CORS_CONFIG object
  - Provides clear visibility of backend's frontend URL configuration for debugging
  - Ensures proper import/export structure for environment variables
- **Deployment visibility**:
  - Health check now shows configured frontend URL for CORS troubleshooting
  - Makes it easier to verify environment configuration correctness
  - Helps with debugging CORS issues during deployment and development
- **Files affected**:
  - backend/src/config/env.ts: Added FRONTEND_URL direct export for proper import
  - backend/src/server.ts: Updated imports and health check response field

#### `[PENDING]` - **fix(database)**: Enhance SQL parsing and add comprehensive logging
- **SQL statement parsing improvements**:
  - Fixed SQL statement parsing logic that caused malformed CREATE TABLE statements
  - Enhanced $$ delimiter handling for PostgreSQL functions with accurate dollar-sign counting
  - Proper tracking of function boundaries to prevent premature statement splitting
  - Resolved production deployment CREATE TABLE parsing issues causing "relation does not exist" errors
- **Comprehensive logging system**:
  - Added statement-by-statement execution progress logging (X/Y format)
  - Included timing information for each SQL statement execution
  - Added PostgreSQL error codes for better debugging in production
  - Statement previews displayed when errors occur for troubleshooting
  - Clear distinction between critical errors and "already exists" conditions
- **Database state verification**:
  - Added comprehensive database verification after initialization
  - Checks for required tables (topics, articles) existence
  - Lists all created tables and indexes for debugging
  - Provides detailed logging of database state
- **Error handling improvements**:
  - Enhanced error categorization (critical vs skippable errors)
  - Better handling of "object already exists" scenarios
  - Improved error messages with statement context
- **Files affected**:
  - backend/src/shared/database/init.ts: Enhanced SQL parsing, logging, and error handling

#### `0504172` - **fix**: Resolve production deployment schema path detection
- **Database initialization fixes**:
  - Fixed schema file path detection for both development and production environments
  - Auto-detects environment based on __dirname containing '/src/' (development) vs not (production)
  - Development mode: ../../../database/schema.sql, Production mode: ../../database/schema.sql
  - Added detailed logging showing detected environment and computed path
  - Resolves production deployment failures where schema.sql wasn't found in build output
- **Build process integration**:
  - Leverages existing database folder copying in build script (cp -r database dist/)
  - Maintains single source of truth for schema files
  - Works seamlessly with tsx dev mode and compiled production builds
- **Error handling improvements**:
  - More descriptive error messages for missing schema files
  - Environment-specific path resolution with fallback detection
- **Files affected**:
  - backend/src/shared/database/init.ts: Fixed path detection and added environment logging

#### `c7dcdf0` - **fix**: Resolve database initialization failures in production
- **Database initialization fixes**:
  - Fixed schema file path detection for both development and production environments
  - Added database file copying to build process (database folder -> dist/database)  
  - Improved error handling to fail fast on critical database errors instead of claiming success
  - Added database permission and connection verification
  - Schema path now auto-detects: ../../../database/schema.sql (dev) vs ../../database/schema.sql (prod)
- **Build process improvements**:
  - Modified backend build script to copy database folder to dist for production
  - Maintains single source of truth for schema (no manual sync needed)
  - Works in both tsx dev mode and compiled production mode
- **Files affected**:
  - backend/package.json: Added database folder copying to build script
  - backend/src/shared/database/init.ts: Fixed path detection and error handling

#### `5737036` - **feat**: Add Railway deployment watch paths to optimize build triggers
- **Railway deployment optimization**:
  - Added watch patterns to railway.json to trigger deployments only when backend/shared code changes
  - Prevents unnecessary deployments when only frontend code is modified
  - Watch patterns include: backend/**, shared/**, package.json, pnpm-workspace.yaml, railway.json
  - Saves Railway compute resources and reduces deployment time
- **Files affected**:
  - railway.json: Added watch configuration with specific patterns

#### `9c5594e` - **feat**: Implement database auto-initialization and cleanup migration files
- **Database architecture improvements**:
  - Added automatic database schema initialization on server startup
  - Created modular database architecture with separate pool, query, and initialization modules  
  - Database safely creates tables and indexes if they don't exist without dropping existing data
  - Schema initialization reads and executes schema.sql with IF NOT EXISTS safety checks
- **Migration cleanup**:
  - Removed migration files since not in production yet (migrations/, migrate-topics-to-array.sql)
  - Updated seed.sql to use topics array format instead of single topic field
  - Fixed schema.sql syntax error (removed trailing comma)
- **Backend build improvements**:
  - Added build:prod script to backend package.json for Railway deployment
  - Updated railway.json to use simplified backend build command
- **Files affected**:
  - backend/src/shared/database/: New modular architecture (pool.ts, query.ts, init.ts)
  - backend/database/schema.sql: Fixed syntax error
  - backend/database/seed.sql: Updated to use topics arrays
  - backend/package.json: Added build:prod script
  - railway.json: Simplified deployment commands

#### `80ecdeb` - **fix**: Correct SQL query in dashboard repository for topics array
- **Database query fix**:
  - Fixed getRecentArticles query to select 'topics' array instead of non-existent 'topic' column
  - Updated result mapping to handle topics array properly, using first topic or 'No Topic' as fallback
  - Resolves "Failed to fetch recent articles" error in admin dashboard
- **Files affected**:
  - backend/src/features/dashboard/dashboard.repository.ts: Fixed SQL query and result mapping

#### `d271fb9` - **refactor**: Simplify environment variable configuration
- **Environment variable refactoring**:
  - Removed redundant getEnvVar utility function from frontend/src/config/env.ts
  - Simplified environment variable access to use process.env directly
  - Cleaned up API URL configuration across all services
- **Code cleanup**:
  - Removed unused imports and variables from apiClient.ts
  - Simplified BE_API_URL exports and usage in env.ts
  - Updated all service files to use simplified environment configuration
  - Fixed Header.tsx import path consistency
- **Files affected**:
  - frontend/src/api/apiClient.ts: Removed unused getEnvVar import
  - frontend/src/components/Header.tsx: Import path consistency
  - frontend/src/config/env.ts: Removed getEnvVar function, simplified exports
  - frontend/src/lib/server-data.ts: Updated to use simplified env config
  - frontend/src/services/articleService.ts: Updated import and usage
  - frontend/src/services/dashboardService.ts: Simplified API URL usage
  - frontend/src/services/topicService.ts: Updated import and usage

#### `3f601ee` - **fix**: Merge vercel-deployment branch to master
- **MERGE COMMIT**: Combined multiple deployment and environment configuration fixes
- **vercel.json updates**:
  - Updated to use "framework": "nextjs" for proper Next.js detection
  - Removed invalid "rootDirectory" property that caused schema validation errors
  - Added "outputDirectory": "frontend/.next" for monorepo build output
- **railway.json updates**:
  - Fixed monorepo build process: `pnpm install && pnpm --filter shared build && pnpm --filter backend build && pnpm --filter backend start:prod`
  - Ensures shared package builds before backend to resolve TypeScript import errors
- **Centralized environment configuration**:
  - Created frontend/src/config/env.ts and backend/src/config/env.ts
  - Updated all services to use centralized configuration instead of direct process.env
  - Fixed server-data.ts to use BE_API_URL from centralized config instead of API_URL
  - Standardized API base URL handling across frontend and backend
- **Files affected**:
  - .gitignore, package.json, pnpm-lock.yaml
  - vercel.json, railway.json
  - frontend/package.json, frontend/src/config/env.ts, frontend/src/lib/server-data.ts
  - frontend/src/api/apiClient.ts, frontend/src/services/*.ts
  - backend/src/config/env.ts, backend/src/server.ts, backend/src/shared/database/connection.ts
- **Deployment fixes**: Resolved Vercel build failures and Railway TypeScript errors
- **Environment consistency**: All services now use BE_API_URL with http://localhost:3002/api default


#### `d443c5b` - **chore**: Clean up unused backend files and code
- Removed 4 unused files from early development phases
  - backend/src/types/database.ts (replaced by @singularity-news/shared types)
  - backend/src/lib/client.ts (unused database abstraction layer)
  - backend/src/lib/supabase.ts (unused Supabase client configuration)
  - backend/src/shared/utils/topic.mapper.ts (duplicate mapper functionality)
- Removed empty directories after file cleanup
  - backend/src/types/ directory
  - backend/src/lib/ directory
- Cleaned up debug code from article.service.ts
  - Removed console.log statement from createArticle method
- All remaining backend files are actively used and necessary

### 2025-08-23

#### `3220be4` - **fix**: Enhance Railway deployment with improved logging and error handling
- Enhanced Railway deployment configuration to resolve "service unavailable" errors
  - Updated railway.json with longer health check timeout (300s) and improved start command
  - Added comprehensive logging with emojis and proper container networking to server.ts
  - Configured server to bind to 0.0.0.0 for proper Railway container access
  - Added detailed startup logging with environment, port, and health check information
- Improved database connection error handling and logging
  - Enhanced database connection.ts with better error reporting
  - Added startup connection test with detailed error messages
- Removed Dockerfile to use Railway's Nixpacks auto-detection for optimal builds
- Addresses Railway deployment failures and provides better debugging capabilities

#### `c362db1` - **fix**: Move homepage from route group to root to resolve Vercel 404
- Fixed Vercel deployment 404 error by restructuring homepage location
  - Moved frontend/src/app/(public)/page.tsx to frontend/src/app/page.tsx
  - Added Header, Navigation, and Footer components directly to root page
  - Ensures root route "/" properly resolves on Vercel deployment platform
  - Maintains identical layout and functionality as previous route group structure
- Route group structure was causing Next.js routing conflicts on Vercel
- Root page now serves homepage content with proper navigation components
- Resolves "404: NOT_FOUND" error that was preventing site access

#### `d58f2af` - **feat**: Prepare backend for Railway deployment
- Created comprehensive Railway deployment configuration
  - Added railway.json with build commands and health check settings
  - Updated CORS configuration to be environment-aware for production
  - Created .env.example with all required environment variables
- Enhanced server.ts with flexible origin handling for development/production
- Prepared backend for PostgreSQL integration on Railway platform
- Ready for seamless deployment with database migration support

#### `1585bc4` - **fix**: Remove functions runtime config to let Vercel auto-detect
- Simplified vercel.json by removing functions runtime configuration
- Allows Vercel to automatically detect and use appropriate Node.js runtime
- Eliminates potential compatibility issues with runtime version specification
- Streamlines deployment process with Vercel's intelligent defaults

#### `43003f6` - **fix**: Use nodejs18.x runtime for Vercel compatibility  
- Updated Vercel functions runtime from nodejs20.x to nodejs18.x
- Resolved Vercel build failure: "Function Runtimes must have a valid version"
- Ensures compatibility with Vercel's supported Node.js runtime versions

#### `587b072` - **feat**: Migrate from single topic to multiple topics array
- Completely restructured topic system to support multiple topics per article
- **Database Changes**:
  - Created migration script to convert existing topic column to topics array
  - Updated schema.sql with topics TEXT[] and GIN index for performance
  - Migrated 7 existing articles to new structure
  - Removed foreign key constraint (complex for array elements in PostgreSQL)
- **Backend Architecture**:
  - Updated Article interface to use topics: string[] instead of topic: string
  - Modified all DTOs with comprehensive array validation
  - Enhanced repository queries with PostgreSQL && operator for array overlap
  - Updated service layer methods for array handling
- **Frontend Implementation**:
  - Built multi-select topic interface with SearchableTopicDropdown
  - Added topic badges throughout UI (ArticlesTable, MainContent, RelatedArticles)
  - Implemented dynamic topic breadcrumbs in ArticleDetail
  - Enhanced ArticleForm with add/remove topic functionality
- **User Experience Improvements**:
  - Visual topic badges with blue color scheme
  - Dropdown filters out already selected topics
  - Click-to-remove functionality for selected topics
  - Maintains backward compatibility with existing data

#### `85d40d9` - **docs**: Update GIT_HISTORY.md with deployment configuration commit

#### `fe22a37` - **build**: Add Vercel deployment configuration for monorepo
- Added vercel.json configuration file for proper Vercel deployment
  - Custom build command that builds shared package before frontend
  - Configured output directory to frontend/.next for Next.js build
  - Set install command to use pnpm for workspace dependency management
  - Added ignore command to only rebuild when frontend/ or shared/ directories change
  - Configured Node.js 20.x runtime for API functions (matching development environment)
- Created build.sh script for deployment build process
  - Ensures proper build order: install dependencies → build shared → build frontend
  - Provides clear logging for build steps and error handling
  - Compatible with Vercel's build environment
- Updated frontend package.json build scripts
  - Modified build script to depend on shared package compilation
  - Added build:vercel script specifically for Vercel deployment
  - Maintains compatibility with local development workflow
- Resolves monorepo deployment issue where shared package was not found during build

#### `6f9c127` - **feat**: Implement always-visible Navigation and WSJ-style article design
- Implemented always-visible Navigation component across all public pages
  - Created (public) route group with shared layout including Header, Navigation, Footer
  - Moved homepage and article pages to route group structure
  - Navigation now appears on home page, article detail pages, and future public pages
- Redesigned article detail page following Wall Street Journal design principles
  - Centered layout with max-width container for better readability
  - Large, bold headline (4xl/5xl) with proper hierarchy
  - Topic breadcrumb with blue links and separator (TOPIC | CATEGORY style)
  - Clean action bar with Share, font resize (Aa), and Listen features
  - Professional typography with justified text and optimal line spacing
  - Author and publication date prominently displayed
- Enhanced pre-commit hooks with TypeScript checking
  - Added pnpm tsc validation to catch type errors before commit
  - Maintains existing lint fixes and GIT_HISTORY.md validation
  - Provides clear error messages and guidance for developers
- Fixed linting errors to ensure clean builds
  - Replaced HTML anchor tags with Next.js Link components
  - Fixed HTML entity escaping for apostrophes
  - Removed trailing spaces from components

#### `42e4abf` - **refactor**: Improve admin UI with elegant color scheme and fix UI issues
- Implemented elegant navy/amber color scheme across admin interface
  - Deep slate-700 sidebar with amber-500 accents for active states
  - Light slate-50 background for main content area
  - Clean white cards with slate borders for tables and filters
- Fixed UI issues:
  - Removed double borders on filter inputs by using focus:border-transparent
  - Fixed missing edge line on filters card with explicit border-slate-200
  - Added hover effect to Clear Filters button with smooth transitions
  - Fixed sidebar height to always be full viewport using fixed positioning
  - Fixed table border extending too far with overflow-hidden container
- Removed unnecessary adminColors.ts configuration file
  - Simplified codebase by using Tailwind classes directly
  - Eliminated redundant color abstraction layer
  - Improved maintainability and IDE support
- Applied consistent styling to TopicsTable matching ArticlesTable
  - Updated header to bg-slate-100 
  - Changed text colors to slate color scheme
  - Added amber accent for edit buttons
- Updated Topics page to match Articles page design
  - Consistent slate text colors and amber buttons
  - Matching button sizing and rounded corners

### 2025-08-17

#### `fea989a` - **chore**: Add install:all npm script for workspace package management
- Added `"install:all": "pnpm install"` script to root package.json
- Provides unified command to install dependencies across all workspace projects (frontend, backend, shared)
- Simplifies development setup by running `npm run install:all` from project root
- Leverages pnpm workspace functionality to handle all subproject dependencies automatically
- Fixed character encoding issue in backend/src/routes/admin.ts (removed § symbol from import)

#### `ce0385c` - **refactor**: Improve UI consistency for admin pages
- Refactored Topics page header to match Articles page clean style
- Removed white background card wrapper from Topics header
- Removed TagIcon from Topics header for simpler design
- Changed "Topics Management" title to "Topics" for consistency
- Added cursor-pointer to both New Article and Add Topic buttons
- Fixed ESLint issues in RelatedArticles (removed unused setState)
- Fixed trailing spaces in AdminDashboard component
- Removed unused imports (TagIcon, buttonStyles) from Topics page

#### `c4b88eb` - **feat**: Implement real-time dashboard with live statistics
- Created dashboard feature module with MVC architecture:
  - DashboardController handling HTTP requests
  - DashboardService implementing business logic
  - DashboardRepository for database queries
- Added API endpoints for dashboard metrics:
  - `/api/admin/dashboard/stats` for statistics overview
  - `/api/admin/dashboard/recent-articles` for recent articles list
- Implemented comprehensive database queries:
  - Article statistics (total, published, drafts)
  - View metrics (total views, average per article)
  - Topic counts and last month comparisons
- Updated AdminDashboard component:
  - Fetch real data from backend APIs
  - Display loading states with skeleton UI
  - Show live statistics instead of hardcoded values
- Dashboard now displays:
  - Total articles with published/draft breakdown
  - Total and average views with trend indicators
  - Active topics count
  - Recent articles with titles, views, and status

#### `fc4f371` - **refactor**: Create reusable table components for DRY code
- Created TableHeader and TableCell components with content projection
- Added variant prop for TableHeader (default/compact) for different styles
- Added align prop for TableHeader (left/center/right) for text alignment
- Replaced all table headers and cells in ArticlesTable with reusable components
- Replaced all table headers and cells in TopicsTable with reusable components
- Made both tables use consistent styling (default variant) for uniformity
- Removed class overrides and !important flags for cleaner code
- Improved maintainability with single source of truth for table styling

#### `8e4f5bd` - **feat**: Improve article typography and interactive elements
- Enhanced article body text with line height of 1.8 for better readability
- Added letter spacing (0.01em) for improved character distinction
- Made Share button more distinctive with indigo background and hover effects
- Added cursor-pointer and hover states to all interactive buttons
- Reorganized metadata layout into 3 clear rows (author/views, date, buttons)
- Updated date format to "Aug. 17, 2025 10:16 am PST" using browser's local timezone
- Made font size controls affect title, summary, and body text proportionally
- Adjusted title and summary font sizes for better visual proportion

#### `1e9067e` - **refactor**: Implement content projection for RelatedArticles component
- Extract Related Articles section to dedicated component
- Implement content projection pattern using React children
- Update ArticleDetail to accept children prop for flexibility
- Reorganize article metadata layout:
  - Move views count to same row as author (right-aligned)
  - Make views count bold for better visibility
  - Move updated date to same row as action buttons
- Pass RelatedArticles as children to ArticleDetail in article page
- Improve component composition and reusability

#### `ca54d07` - **feat**: Implement topics management UI with CRUD operations
- Create complete topics management interface at /admin/topics
  - TopicsTable component displays all topics with name and slug
  - TopicModal component for both create and edit operations
  - Delete functionality with browser confirmation dialog
- Implement modal-based UI pattern matching articles management
  - Single modal handles both add and edit modes
  - Auto-close on successful save
  - Loading states and error handling
- Add notification system for admin actions
  - Success and error toast notifications
  - Auto-dismiss after 5 seconds
  - Manual dismiss option with slide-in animation
- Simplify topic creation/editing
  - Remove slug field from forms (auto-generated by backend)
  - Only name field required for both create and update
  - Display generated slug as readonly in table
- Fix delete operation error handling
  - Handle 204 No Content responses properly
  - Fix "Unexpected end of JSON input" error
- Update TopicService with full CRUD operations
  - getTopics, getTopicById, createTopic, updateTopic, deleteTopic
  - Proper response handling for empty responses
- Implement reactive updates with refetch pattern
  - Automatic list refresh after create/update/delete
  - Uses observables subscription pattern
- UI improvements
  - Add Topic button displays inline with flex layout
  - Slug shown in monospace font for better readability
  - Informational text about auto-generated slugs
- Update adminStore with success message state management

#### `f9369ec` - **feat**: Add live preview and centralize button styles
- Create ShareService to extract sharing functionality from ArticleDetail component
  - Supports Web Share API with clipboard fallback
  - Handles platform-specific sharing (Twitter, Facebook, LinkedIn, email)
  - Generates shareable URLs for articles
- Add isPreview prop to ArticleDetail for conditional feature display
  - Hides navigation breadcrumb in preview mode
  - Disables sharing and follow buttons in preview
  - Shows preview mode indicator banner
- Integrate live preview in ArticleForm with Edit/Preview toggle
  - Real-time preview using actual ArticleDetail component
  - Toggle between edit and preview modes
  - Preview shows exactly how article will appear when published
- Add cursor-pointer to all clickable buttons and interactive elements
  - Updated ArticleDetail, ArticleForm, ArticleFilters components
  - Added to SearchableTopicDropdown and all button elements
- Create centralized buttonStyles.ts with consistent design system
  - Primary: Main CTA buttons (indigo background)
  - Secondary: Alternative actions (white with border)
  - Ghost: Minimal styling for icon buttons
  - Icon: Icon-only buttons with hover background
  - Danger: Destructive actions (red)
  - Link: Link-style buttons
  - Tab: Tab navigation buttons
  - Toggle: Mode switching buttons
  - Pagination: Pagination controls
- Refactor all button components to use centralized styling
  - ArticleForm now uses buttonStyles for all buttons
  - ArticleFilters uses buttonStyles for toggle and clear buttons
  - ArticleDetail uses ghost style for action buttons
- Fix linting errors in shareService (remove unused error variables)

### 2025-08-16

#### `f9f69c5` - **refactor**: Improve form UI and centralize font family configuration
- Increased form padding from p-8 to p-12 for more spacious layout
- Increased RichTextEditor height from 600px to 800px (min-height 750px)
- Fixed RichTextEditor scrolling issue with proper flex layout
- Added p-2 padding to all input fields for consistency
- Moved Tags field above Cover Photo field for better form flow
- Changed summary character limit from 300 to 400
- Added vertical padding (py-4) and line-height to summary textarea
- Centralized font family configuration in globals.css
- Set Georgia serif as default font throughout the app
- Removed all inline font-serif classes from components (8 instances)
- Created CSS variables for primary (serif) and secondary (sans-serif) fonts

#### `f9f69c5` - **refactor**: Create shared ArticleForm component and fix edit route
- Create shared ArticleForm component (~500 lines) with all form UI and validation logic
- Refactor NewArticleForm to use shared component (reduced from 472 to 60 lines)
- Refactor EditArticleForm to use shared component (reduced from 419 to 130 lines)
- Fix article edit route to accept UUID strings instead of integers
- Remove parseInt() conversion that was breaking UUID-based article IDs
- Add proper TypeScript type checking for optional form fields
- Remove unused setSuccess method references from adminStore
- Add validation to ensure required fields are defined before submission
- Total code reduction: ~900 lines to ~690 lines
- Benefits: Single source of truth, easier maintenance, clear separation of concerns

#### `6a7d4b6` - **fix**: Simplify topics$ observable and add commit requirements to CLAUDE.md
- Remove unnecessary from() wrapper in switchMap (handles Promises automatically)
- Move tap and catchError to main pipeline level for cleaner code
- Use of([]) instead of from([[]]) for error case
- Add explicit "Never Commit Without Explicit Instruction" rule to CLAUDE.md
- Make commit requirements clearer with three mandatory rules
- Emphasize waiting for user instruction before committing or pushing

#### `e9dff4d` - **fix**: Remove cover photos from seed data to resolve Next.js Image configuration error
- Remove cover_photo and cover_photo_caption from INSERT statement
- Remove all Unsplash image URLs and captions from article values  
- Remove cover photo fields from ON CONFLICT UPDATE clause
- Fixes Next.js error about unconfigured hostname for images.unsplash.com
- Maintains all other article data (content, summaries, authors, tags, etc.)
- This is a temporary solution until Next.js is configured to allow external image domains

#### `a5392dc` - **feat**: Add author field and cover photo caption to articles
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
- **Total Commits**: 43 (41 in master, 2 unique to feat-001)
- **Contributors**: georgexon, George Xonikis
- **Active Development Period**: August 7-17, 2025
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