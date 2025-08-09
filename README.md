# AI News Website

A modern AI news website built with Next.js, Express.js, and PostgreSQL. Features a classic newspaper design with contemporary functionality and a robust full-stack architecture.

## **Website UI Requirements**

* **Modern, Minimalistic Design:**
  The website must utilize a clean, minimalistic, and contemporary design. The UI should be intuitive and visually appealing, providing a seamless experience across devices (desktop, tablet, mobile) with responsive layouts. The provided UI template is a reference and allows for adaptation; pixel-perfect implementation is not required.

* **Admin Section:**
  There must be a secure, authenticated admin area for site administrators to manage content and site settings.

---

## **User Stories**

**Admin Functionality**

1. **Create Article:**
   As an admin, I want to create new articles by providing a title, cover photo, and article content so that I can publish news easily.

2. **Edit/Remove Article:**
   As an admin, I want to edit or delete existing articles so that I can maintain accurate and up-to-date content.

3. **Secure Login:**
   As an admin, I want to securely log in to the admin area.

**User Functionality**
4. **Read Articles:**
As a user, I want to read articles in a clear, accessible format.

5. **Search Articles:**
   As a user, I want to search articles by title, keyword, or content so that I can quickly find relevant news.

6. **Browse Topics:**
   As a user, I want to navigate between different topics (e.g., Economy, Politics, History, etc.) so I can explore content by area of interest.

## 🚀 Features

### **Frontend (Next.js)**
- ✅ Modern newspaper-style design inspired by classic publications
- ✅ Responsive layout optimized for all devices
- ✅ Server-side rendering (SSR) for optimal SEO
- ✅ Dynamic article browsing and search functionality
- ✅ Category-based navigation
- ✅ Popular articles sidebar
- ✅ Featured article hero section

### **Backend (Express.js)**
- ✅ RESTful API with comprehensive endpoints
- ✅ PostgreSQL database with Docker for local development
- ✅ TypeScript-based services with proper data transformation
- ✅ Connection pooling and query optimization
- ✅ Full-text search capabilities
- ✅ CORS and security middleware (Helmet)
- ✅ Environment-based configuration

### **Admin Features**
- 🚧 Secure admin authentication (Supabase Auth integration)
- 🚧 Protected admin dashboard with role-based access
- 🚧 Rich text editor for article creation
- 🚧 Category management system
- 🚧 Article CRUD operations with user attribution
- 🚧 Image upload and management
- 🚧 Analytics and view tracking

### **Technical Features**
- ✅ TypeScript throughout the entire stack
- ✅ Monorepo architecture with shared type system
- ✅ Server-side rendering (SSR) for optimal SEO
- ✅ Docker containerization for development environment
- ✅ PostgreSQL with full-text search and triggers
- ✅ Data transformation layer for consistent APIs
- ✅ Comprehensive error handling and logging

## 🏗️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 15.4.5, React 19, TypeScript, Zustand 5.0.7 |
| **Backend** | Express.js, TypeScript, Node.js 20 |
| **Database** | PostgreSQL (Docker for local dev, Supabase for production) |
| **Authentication** | Supabase Auth (integrated with PostgreSQL) |
| **Shared** | TypeScript interfaces, utilities, constants |
| **Styling** | Tailwind CSS 4.1.11 (default config) |
| **Development** | Docker Compose, pnpm workspaces |
| **Package Manager** | PNPM workspaces |

## 🛠️ Architecture Decisions

### **Database & Authentication Strategy**
- **Local Development**: Docker PostgreSQL (port 5433) with Redis (port 6380)
- **Production**: Supabase PostgreSQL + Supabase Auth (unified ecosystem)
- **Benefits**: Full SQL capabilities, ACID compliance, integrated user management, built-in JWT tokens, social authentication

### **Rendering Strategy**
- **Server-Side Rendering (SSR)**: Converted from client-side to server components
- **Benefits**: Better SEO, faster initial page loads, reduced client-side JavaScript

### **Type Safety**
- **Shared Type System**: Centralized TypeScript interfaces in `@singularity-news/shared`
- **Data Transformation**: Convert snake_case database fields to camelCase API responses
- **Benefits**: Type safety across frontend/backend, no type duplication, consistent APIs

### **Authentication & User Management**
- **Supabase Auth**: Unified authentication with database integration
- **Built-in Features**: User registration, password reset, email verification, social logins
- **JWT Tokens**: Seamless token-based authentication with automatic refresh
- **Row-Level Security**: Database-level access control integrated with user roles
- **Benefits**: Single provider ecosystem, reduced complexity, enterprise-grade security

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PNPM 9+
- Docker & Docker Compose

### Development Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd singularity-news
pnpm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit the .env files as needed (see ENV_SETUP.md for details)

# Start development environment
docker-compose up -d          # Start PostgreSQL & Redis
pnpm --filter shared build    # Build shared types first
pnpm --filter backend dev     # Start backend API (port 3002)
pnpm --filter frontend dev    # Start frontend (port 3000)
```

### Key Commands
```bash
# Workspace management
pnpm install                    # Install all dependencies
pnpm -r build                   # Build all packages
pnpm -r dev                     # Run all packages in dev mode

# Frontend specific (port 3000)
pnpm --filter frontend dev      # Run development server
pnpm --filter frontend build    # Build for production
pnpm --filter frontend lint     # Lint code

# Backend specific (port 3002)
pnpm --filter backend dev       # Run development server
pnpm --filter backend build     # Build TypeScript
pnpm --filter backend start     # Start production server

# Shared module
pnpm --filter shared build      # Build shared types
pnpm --filter shared dev        # Watch mode for types
```

### Database Access
- **PostgreSQL**: `localhost:5433` (username: `postgres`, password: `dev_password_123`)
- **Redis**: `localhost:6380` (for upcoming features - see note below)
- **Database**: `singularity_news`

### Redis Usage Note
Redis is included in the development environment but **not currently used**. It will be essential for upcoming features:
- **Session Management**: JWT token storage for admin authentication (Step 5)
- **API Caching**: Cache expensive PostgreSQL queries for better performance
- **Rate Limiting**: Protect API endpoints from abuse
- **Background Jobs**: Queue tasks like email notifications and image processing

Current queries are fast enough with direct PostgreSQL access, but Redis will become valuable as the application grows.

### Code Quality
- **TypeScript**: Strict type checking enabled across all packages
- **ESLint**: Enhanced rules for indentation, quotes, and code quality  
- **Prettier**: Code formatting with Next.js integration

## 📋 Development Progress

### Current Status: Step 4 Complete ✅
We follow a systematic 12-step development process. Each step is a checkpoint with specific deliverables and acceptance criteria.

### Progress Overview

- ✅ **Step 1**: Monorepo Structure Setup - *Completed*
- ✅ **Step 2**: Frontend Boilerplate & Architecture Setup - *Completed with SSR*  
- ✅ **Step 3**: Backend Boilerplate - *Completed with PostgreSQL + Docker*
- ✅ **Step 4**: Shared Module Setup - *Completed with TypeScript interfaces*
- 🚧 **Step 5**: Authentication Foundation - *Next: Supabase Auth integration*
- ⏳ **Step 6**: Database Schema & User Management Integration  
- ⏳ **Step 7**: Article CRUD API & Admin UI
- ⏳ **Step 8**: User-Facing Article Listing and Reading
- ⏳ **Step 9**: Article Search Functionality
- ⏳ **Step 10**: SEO Optimisation  
- ⏳ **Step 11**: Dockerisation & Deployment
- ⏳ **Step 12**: Quality Assurance & Documentation

### Completed Steps Detail

### **Step 1: Monorepo Structure Setup** ✅

**Delivered:**
- PNPM workspace configuration with 4 packages: `frontend/`, `backend/`, `shared/`, and root
- Proper TypeScript configuration across all packages
- Git repository with initial commit structure

### **Step 2: Frontend Boilerplate & Architecture Setup** ✅

**Key Decisions Made:**
- **Server-Side Rendering**: Converted from client-side to server components for better SEO
- **Zustand Integration**: State management preserved for future interactive features
- **Layered Architecture**: API client → Server data layer → SSR components

**Delivered:**
- Next.js 15.4.5 with React 19 and TypeScript
- Tailwind CSS 4.1.11 with responsive newspaper design
- Server-side data fetching with `cache: 'no-store'`
- Enhanced ESLint configuration with strict indentation rules

### **Step 3: Backend Boilerplate** ✅

**Key Decisions Made:**
- **Database**: PostgreSQL instead of Firebase for better SQL capabilities
- **Local Development**: Docker PostgreSQL (port 5433) + Redis (port 6380)
- **Production Strategy**: Supabase for managed PostgreSQL hosting

**Delivered:**
- Express.js server with TypeScript and comprehensive middleware
- Docker Compose setup with PostgreSQL and Redis
- Database schema with articles, topics, full-text search, and triggers
- Complete REST API with pagination and search endpoints
- CORS configuration and security headers (Helmet)

### **Step 4: Shared Module Setup** ✅

**Key Decisions Made:**
- **Centralized Types**: `@singularity-news/shared` package for type consistency
- **Data Transformation**: Convert snake_case DB fields to camelCase API responses
- **Utilities & Constants**: Shared functions and API endpoint constants

**Delivered:**
- TypeScript interfaces: `Article`, `Topic`, `CreateArticleInput`, `UpdateArticleInput`
- API response types: `ApiResponse`, `PaginatedResponse`, `ApiError`
- Utility functions: `slugify`, `formatDate`, `truncateText`, `isValidEmail`
- Full integration: Frontend and backend both use shared types
- Data transformation layer ensuring consistent API responses

---

## 🔮 Next Steps

### **Step 5: Authentication Foundation** (In Progress)

**Goal:** Implement Supabase Authentication for secure admin access

**Planned Approach:**
- Supabase Auth SDK integration on frontend and backend
- Protected admin routes with authentication middleware
- JWT token validation using Supabase's built-in JWT system
- Admin login/logout flow with social authentication options
- User management integrated with PostgreSQL database

**Benefits:** Unified ecosystem with database and authentication from same provider, built-in user table integration, and seamless JWT token handling.

## 📊 Current System Status

### ✅ **Working Features**
- **Full-stack integration**: Frontend (Next.js) ↔ Backend (Express.js) ↔ Database (PostgreSQL)
- **API endpoints**: `GET /api/articles`, `GET /api/topics` with search and filtering
- **Type safety**: Shared TypeScript interfaces across frontend/backend
- **Database**: PostgreSQL with full-text search, auto-incrementing views, and sample data
- **Development environment**: Docker Compose with PostgreSQL + Redis

### 🔧 **Technical Verification**
```bash
# Backend API Test
curl http://localhost:3002/api/articles
curl http://localhost:3002/api/topics

# Frontend Build Test  
pnpm --filter frontend build  # ✅ Successful

# Database Test
psql -h localhost -p 5433 -U postgres -d singularity_news
```

### 📁 **Project Structure**
```
singularity-news/
├── frontend/          # Next.js 15.4.5 + React 19 + TypeScript
├── backend/           # Express.js + TypeScript + PostgreSQL  
├── shared/            # Shared TypeScript interfaces & utilities
├── docker-compose.yml # PostgreSQL + Redis for development
└── README.md          # This comprehensive guide
```

---

**Ready for Step 5: Authentication Foundation** 🔐
