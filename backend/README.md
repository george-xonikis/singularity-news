# Backend

Express.js API server with TypeScript and PostgreSQL for the AI News Website.

# API Architecture Documentation

## Overview

This project follows a **Feature-Based Architecture** with clean separation of concerns, designed for maintainable and scalable Express.js APIs. The architecture emphasizes modularity, testability, and clear boundaries between different layers of the application.

## Architecture Principles

- **Feature-Based Organization**: Code is organized by business features rather than technical layers
- **Single Responsibility**: Each file has a clear, focused responsibility
- **Dependency Injection**: Loose coupling between components for better testability
- **DTO Pattern**: Clear data contracts for API requests and responses using shared types
- **Repository Pattern**: Abstracted data access layer with direct SQL queries
- **Shared Types**: Monorepo integration with @singularity-news/shared package

## Project Structure

```
src/
├── features/
│   ├── feature-name/
│   │   ├── dtos/
│   │   │   ├── create-feature.dto.ts
│   │   │   ├── update-feature.dto.ts
│   │   │   ├── feature-query.dto.ts
│   │   │   ├── feature-response.dto.ts
│   │   │   └── index.ts
│   │   ├── feature.controller.ts
│   │   ├── feature.service.ts
│   │   ├── feature.repository.ts
│   │   ├── feature.mapper.ts         # Database ↔ Domain mapping
│   │   └── feature.routes.ts
│   └── another-feature/
│       └── ...
├── shared/
│   ├── middleware/
│   │   └── error-handler.ts         # Global error handling
│   ├── utils/
│   │   └── helpers.ts              # Common utilities
│   └── database/
│       └── connection.ts           # PostgreSQL connection
├── routes/                         # Legacy routes (being phased out)
├── services/                       # Legacy services (being phased out)  
├── lib/                           # Legacy lib files
└── server.ts                      # Express app configuration
```

## Layer Responsibilities

### Features Directory (`/features`)

Contains business features organized as self-contained modules. Each feature follows the same internal structure:

#### **Controller (`feature.controller.ts`)**
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
    - Parse and validate HTTP requests using Express types
    - Create and validate DTOs with shared types
    - Call appropriate service methods
    - Format HTTP responses using Response DTOs
    - Handle HTTP status codes and proper error responses
    - UUID validation and parameter checking

#### **Service (`feature.service.ts`)**
- **Purpose**: Implement business logic and orchestration
- **Responsibilities**:
    - Execute business rules and validation
    - Coordinate between repositories and external services
    - Handle complex workflows and business constraints
    - Transform data between DTOs and repository layer
    - Manage side effects (notifications, logging, etc.)

#### **Repository (`feature.repository.ts`)**
- **Purpose**: Abstract data access operations with direct SQL
- **Responsibilities**:
    - Provide clean interface for data operations
    - Execute optimized SQL queries with parameterization
    - Handle database connections and transactions
    - Map between database models and domain objects
    - Implement data filtering, sorting, and pagination
    - **No ORM** - direct SQL for performance

#### **Routes (`feature.routes.ts`)**
- **Purpose**: Define API endpoints with dependency injection
- **Responsibilities**:
    - Map HTTP methods and paths to controller methods
    - Set up dependency injection (Repository → Service → Controller)
    - Bind controller methods to preserve 'this' context
    - Group related endpoints logically

#### **Mapper (`feature.mapper.ts`)**
- **Purpose**: Transform between database and domain representations
- **Responsibilities**:
    - Convert database rows to domain objects
    - Handle field name mapping (snake_case ↔ camelCase)
    - Transform data types (UUIDs, timestamps, arrays, JSON)
    - Provide bidirectional transformations for create/update operations

#### **DTOs Directory (`/dtos`)**
Data Transfer Objects that define clear contracts using shared types:

- **Request DTOs** (`create-feature.dto.ts`, `update-feature.dto.ts`):
    - Implement shared types from @singularity-news/shared
    - Validate incoming request data with type safety
    - Transform Express req.body/req.query to typed objects
    - Provide validation methods returning error arrays
    - Expose validated data through getters

- **Query DTOs** (`feature-query.dto.ts`):
    - Handle URL query parameters with proper typing
    - Parse pagination, filtering, and sorting parameters
    - Provide defaults and validation for query params

- **Response DTOs** (`feature-response.dto.ts`):
    - Control what data is exposed in API responses  
    - Maintain backward compatibility with existing APIs
    - Provide structured error responses
    - Support both single items and paginated lists

### Shared Directory (`/shared`)

Contains reusable components used across multiple features:

#### **Middleware (`/middleware`)**
- Authentication and authorization
- Request validation
- Error handling
- Logging and monitoring
- Rate limiting and security

#### **Utils (`/utils`)**
- Helper functions and utilities
- Common business logic (validation, formatting, etc.)
- Data transformation utilities  
- Constants and enums

#### **Database (`/database`)**
- PostgreSQL connection configuration with connection pooling
- Parameterized query functions for SQL injection protection
- Connection management and error handling
- **No migrations** - schema managed via Docker init scripts

### Application Entry Point (`server.ts`)

- Express application configuration with TypeScript
- Global middleware setup (CORS, body parsing, logging)
- Feature route registration with clean separation
- Global error handling middleware
- Health check endpoints

## Data Flow

```
HTTP Request
    ↓
Routes (Middleware, Auth)
    ↓
Controller (DTO Validation & Express Types)
    ↓
Service (Business Logic & Shared Types)
    ↓
Repository (SQL Queries & Parameterization)
    ↓
PostgreSQL Database
    ↓
Mapper (Database → Domain Objects)
    ↓
Service (Business Processing)
    ↓
Controller (Response DTO & Error Handling)
    ↓
HTTP Response
```

## Key Benefits

### **Maintainability**
- Clear separation of concerns
- Predictable file structure
- Easy to locate related functionality

### **Scalability**
- Features can be developed independently
- Easy to add new features without affecting existing ones
- Potential to extract features into microservices

### **Testability**
- Each layer can be unit tested in isolation
- Dependency injection enables easy mocking
- Clear interfaces between components

### **Team Collaboration**
- Multiple developers can work on different features simultaneously
- Consistent patterns across all features
- Clear ownership boundaries

## Getting Started

### Adding a New Feature

1. **Create feature directory**: `src/features/new-feature/`
2. **Implement the core files**:
    - `new-feature.controller.ts` - HTTP handling with Express types
    - `new-feature.service.ts` - Business logic with shared types  
    - `new-feature.repository.ts` - Data access with SQL queries
    - `new-feature.mapper.ts` - Database ↔ Domain transformations
    - `new-feature.routes.ts` - Routing with dependency injection
3. **Create DTOs in `dtos/` subdirectory**:
    - Import and implement shared types from @singularity-news/shared
    - Add validation methods and type-safe constructors
4. **Update shared types** (if needed):
    - Add new interfaces to @singularity-news/shared/src/types/
    - Use TypeScript utility types (Pick, Partial, etc.)
5. **Register routes in `server.ts`**:
    - Import and mount feature routes
    - Maintain clean separation from other features

### Development Guidelines

- **Keep business logic in services, not controllers**
- **Use DTOs for all API inputs and outputs** - implement shared types
- **Implement proper error handling** - use ErrorResponseDto at each layer
- **Write TypeScript with strict types** - avoid `any`, use proper typing
- **Use parameterized SQL queries** - never concatenate user input
- **Follow consistent naming conventions** - feature.layer.ts pattern
- **Validate all inputs** - DTOs should validate and transform data
- **Handle undefined/null properly** - use explicit `| undefined` types
- **Test each layer independently** - repositories, services, controllers

## Technology Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with direct SQL queries (no ORM)
- **Architecture Pattern**: Feature-Based with Clean Architecture principles
- **Data Layer**: Repository Pattern with SQL parameterization
- **Types**: Shared types from @singularity-news/shared monorepo package
- **Validation**: Custom DTOs implementing shared types with validation methods
- **Dependency Injection**: Constructor injection in route factories
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Security**: SQL injection protection via parameterized queries

This architecture provides a solid foundation for building maintainable, scalable APIs while keeping the codebase organized and developer-friendly.