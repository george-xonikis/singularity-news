# AI News Website

A modern, AI-news website built with Next.js, Express.js, and Firebase/Firestore. Features a classic newspaper design with contemporary functionality.

## Requirements
Certainly! Here’s a comprehensive, professionally-structured requirements description for your news website project.

---

# **News Website Requirements**

## **1. Website UI Requirements**

* **Modern, Minimalistic Design:**
  The website must utilize a clean, minimalistic, and contemporary design. The UI should be intuitive and visually appealing, providing a seamless experience across devices (desktop, tablet, mobile) with responsive layouts. The provided UI template is a reference and allows for adaptation; pixel-perfect implementation is not required.

* **Admin Section:**
  There must be a secure, authenticated admin area for site administrators to manage content and site settings.

---

## **2. User Stories**

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
- ✅ Firebase/Firestore as the database and storage solution
- ✅ Secure admin-only routes with middleware
- ✅ File upload handling for article images (via Firebase Storage)
- ✅ Server-side search with pagination
- ✅ Rate limiting and security headers

### **Admin Features**
- ✅ Secure admin authentication
- ✅ Rich text editor for article creation
- ✅ Category management system
- ✅ Article CRUD operations
- ✅ Image upload and management
- ✅ Analytics and view tracking

### **Technical Features**
- ✅ TypeScript throughout the entire stack
- ✅ Monorepo architecture with shared utilities
- ✅ Firebase/Firestore for data and storage
- ✅ Docker containerization
- ✅ Comprehensive error handling
- ✅ SEO optimization with meta tags and sitemaps

## 🏗️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 15.4.5, React 19, TypeScript, Zustand 5.0.7 |
| **Backend** | Express.js, TypeScript, Node.js 20 |
| **Database/Storage** | Firebase (Firestore, Storage) |
| **Styling** | Tailwind CSS 4.1.11 (default config) |
| **Deployment** | Docker |
| **Package Manager** | PNPM workspaces |

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting (configure in your IDE)

### Development Steps
Absolutely, that’s a solid approach. Below is a list of **agnostic, clearly-defined development steps** for your project. Each step acts as a checkpoint and is independent, enabling effective parallelization or phased delivery. I have provided a brief description for each and listed deliverables or acceptance criteria where appropriate.

---

#### Workflow:
- We will work on each development step one at a time, as outlined in the README.
- Each step is a checkpoint: after completing a step, we will verify that the app is working as expected for that step.
- Only after successful verification and your approval will we move on to the next step.
- Make sure to pause for your review and confirmation at each checkpoint before proceeding.

### **Step 1: Monorepo Structure Setup**

* **Goal:**
  Scaffold the monorepo with three main directories: `backend`, `frontend`, and `shared`.
* **Acceptance Criteria:**

  * Monorepo created via pnpm workspace.
  * Clearly separated `backend/`, `frontend/`, and `shared/` directories with initial `README.md` files.
  * Repository bootstrapped with version control


Perfect! Here’s what Step 1 involves, based on the README:

### **Step 1: Monorepo Structure Setup**

**Goal:**  
Scaffold the monorepo with three main directories: `backend`, `frontend`, and `shared`.

**Acceptance Criteria:**
- Monorepo created via pnpm workspace.
- Clearly separated `backend/`, `frontend/`, and `shared/` directories with initial `README.md` files.
- Repository bootstrapped with version control.

**Plan:**
1. Initialize a pnpm workspace in the project root.
2. Create the directories: `backend/`, `frontend/`, and `shared/`.
3. Add a minimal `README.md` to each directory.
4. Update the root `pnpm-workspace.yaml` to include all three packages.
5. Ensure version control (git) is initialized if not already.

---

### **Step 2: Frontend Boilerplate & Architecture Setup**

#### **Goals**

* Initialize the Next.js (with TypeScript) project within the `frontend` directory (Next.js 15.4.5).
* Set up foundational architectural layers to decouple data access, API calls, and state management, facilitating easy transition from mock to persistent data.
* Ensure the codebase is modular, maintainable, and easily testable.

#### **Deliverables / Acceptance Criteria**

1. **Project Bootstrapping**

   * Next.js app created with TypeScript (v15.4.5).
   * Tailwind CSS installed and configured (v4.1.11, default config).
   * Folder structure established for `pages/`, `components/`, `styles/`, `api/`, and `store/`.
   * Placeholder homepage rendered.

2. **API Layer**

   * Create an `apiClient.ts` abstraction in `/frontend/api/`.
   * Use the native `fetch` API for HTTP requests.
   * Centralize configuration (e.g., base URL, error handling, etc).
   * Export generic HTTP methods (`get`, `post`, `put`, `delete`).

3. **Data Layer**

   * Create a data access abstraction in `/frontend/api/dataLayer.ts`.
   * Implement all REST calls related to articles, topics, etc. using `apiClient`.
   * Expose functions such as `getArticles()`, `getArticleById(id)`, `createArticle(data)`, etc.
   * Initially, these functions will return hardcoded mock data.
   * Structure the data layer so the API endpoint or data source can be swapped with Firestore or another backend without impacting consuming code.

4. **State Management Layer**

   * Integrate [Zustand](https://zustand-demo.pmnd.rs/) for state management.
   * Create a store in `/frontend/store/` for articles, topics, user session, etc.
   * All components access and update state exclusively via this layer.
   * The store should call dataLayer functions for CRUD operations, making it trivial to update the underlying data source later.
   * Example:

     ```ts
     // store/articleStore.ts
     import create from 'zustand';
     import { getArticles } from '../api/dataLayer';

     type Article = { id: number; title: string; content: string; topic: string };

     interface ArticleState {
       articles: Article[];
       fetchArticles: () => Promise<void>;
     }

     export const useArticleStore = create<ArticleState>((set) => ({
       articles: [],
       fetchArticles: async () => {
         const data = await getArticles();
         set({ articles: data });
       }
     }));
     ```

5. **Folder Structure Example**

   ```
   frontend/
   ├── api/
   │   ├── apiClient.ts
   │   └── dataLayer.ts
   ├── components/
   ├── pages/
   ├── store/
   │   └── articleStore.ts
   ├── styles/
   └── ...
   ```

6. **Testing and Documentation**

   * Include a `README.md` describing the architectural layers and conventions for adding new API/data/state modules.
   * Add example usage in a sample page/component, demonstrating how to fetch and render articles using Zustand and the data layer.
   * **Testing will be skipped for now.**

**Note:**
By isolating the API layer (`apiClient`), data access layer (`dataLayer`), and state layer (Zustand store), you ensure that replacing mock data with persistent backend data (such as Firestore) is a matter of updating only the data layer implementation, leaving all other business logic and UI untouched.

---

### **Step 3: Backend Boilerplate**

* **Goal:**
  Set up backend services in the `backend` directory, integrating Firebase Admin SDK for management operations.
* **Acceptance Criteria:**

  * Basic Node.js/TypeScript backend (e.g., for API routes, admin utilities, or batch jobs if needed).
  * Firebase Admin SDK configured.
  * Initial environment/configuration management (e.g., `.env` setup).

---

### **Step 4: Shared Module Setup**

* **Goal:**
  Create a `shared` directory for code, models, or utilities that are used by both frontend and backend.
* **Acceptance Criteria:**

  * TypeScript interfaces for articles, users, and topics.
  * Shared utility functions (e.g., date formatting, slug generation).
  * Proper import/export setup, with linting and type checking enabled.

---

### **Step 5: Authentication Foundation**

* **Goal:**
  Implement basic Firebase Authentication integration on the frontend.
* **Acceptance Criteria:**

  * Firebase initialized on the frontend.
  * Secure login/logout flow for admins.
  * Protected admin route in the Next.js app.
  * Demo user login works with Firebase Authentication.

---

### **Step 6: Firestore & Storage Integration**

* **Goal:**
  Integrate Firestore and Firebase Storage with the frontend and backend.
* **Acceptance Criteria:**

  * Firestore initialized; able to read/write basic documents.
  * Firebase Storage configured; able to upload and retrieve images/files.
  * Access rules for articles and media assets defined in Firestore/Storage security rules.

---

### **Step 7: Article CRUD API & Admin UI**

* **Goal:**
  Develop core article management: create, edit, delete articles via the admin UI.
* **Acceptance Criteria:**

  * Admin can create, update, and delete articles (title, cover photo, content).
  * Articles are persisted in Firestore and media in Firebase Storage.
  * Admin UI lists all articles with edit/delete options.

---

### **Step 8: User-Facing Article Listing and Reading**

* **Goal:**
  Implement public pages to list articles by topic and view full article details.
* **Acceptance Criteria:**

  * Articles are fetched from Firestore and displayed for users.
  * Topic-based navigation implemented.
  * Individual article pages render correctly and are SEO-optimized.

---

### **Step 9: Article Search Functionality**

* **Goal:**
  Implement full-text search or indexed keyword search for articles.
* **Acceptance Criteria:**

  * Users can search articles by title, keywords, or content.
  * Search results are fast and accurate.
  * Search UI integrated on the frontend.

---

### **Step 10: SEO Optimisation**

* **Goal:**
  Ensure all necessary SEO features are in place.
* **Acceptance Criteria:**

  * SSR/SSG for article and topic pages.
  * Meta tags, structured data, Open Graph tags.
  * Sitemap and robots.txt generated.
  * Accessibility checks passed.

---

### **Step 11: Dockerisation & Deployment**

* **Goal:**
  Containerise the full stack and provide deployment documentation.
* **Acceptance Criteria:**

  * Dockerfiles for frontend and backend.
  * Docker Compose configuration for local development.
  * Deployment guide/documentation.

---

### **Step 12: Quality Assurance & Documentation**

* **Goal:**
  Implement tests, code linting, and write developer/user documentation.
* **Acceptance Criteria:**

  * Basic unit and integration tests.
  * Linting and formatting setup.
  * Project documentation (README, setup instructions, architecture overview).

---

**Notes:**

* Each step can be a PR or a milestone and should be independently verifiable.
* You can further parallelize some steps (e.g., frontend/backend boilerplates can start in parallel after step 1).
* Optional enhancements and features (comments, analytics, newsletter) can be added as further steps after the MVP is completed.

If you want Gantt chart formatting or a Jira-friendly breakdown, let me know!
