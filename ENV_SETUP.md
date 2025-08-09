# Environment Variables Setup Guide

This guide explains how to configure environment variables for the AI News Website project.

## 🗂️ Environment Files Structure

```
singularity-news/
├── backend/
│   ├── .env                 # Active backend config (gitignored)
│   ├── .env.example         # Template for backend
│   ├── .env.local           # Local overrides (gitignored)  
│   └── .env.production      # Production config (gitignored)
├── frontend/
│   ├── .env.local           # Active frontend config (gitignored)
│   └── .env.example         # Template for frontend
└── ENV_SETUP.md            # This guide
```

## 🚀 Quick Setup (Development)

### 1. Backend Environment
```bash
cd backend/
cp .env.example .env
# Edit .env with your values (already configured for Docker)
```

### 2. Frontend Environment  
```bash
cd frontend/
cp .env.example .env.local
# Edit .env.local with your values
```

## 📋 Environment Variables Explained

### Backend (`backend/.env`)
- **Server Config**: PORT, NODE_ENV, FRONTEND_URL
- **Database**: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD  
- **Cache**: REDIS_URL
- **Auth**: Supabase credentials (for Step 5)

### Frontend (`frontend/.env.local`)  
- **API**: API_URL (server-side), NEXT_PUBLIC_API_URL (client-side)
- **Supabase**: NEXT_PUBLIC_SUPABASE_* variables for authentication

## 🔧 Current Configuration

### ✅ **Working Now (Step 4 Complete)**
- Backend: Uses environment variables for database connection
- Frontend: Environment variables ready for API calls
- Docker: PostgreSQL and Redis configured

### 🚧 **Ready for Step 5 (Authentication)**
- Supabase Auth configuration placeholders added
- JWT secret placeholders added  
- All authentication variables documented

## 🔒 Security Notes

- ✅ All `.env*` files are gitignored (except `.env.example`)
- ✅ Database passwords hidden in logs
- ✅ Supabase service role keys will be properly secured
- ✅ Separate configs for development/production

## 📖 Next Steps

When setting up **Step 5 (Authentication)**:
1. Create a Supabase project (or use existing one for database)
2. Get Supabase configuration from Project Settings -> API
3. Update environment variables with real values
4. Configure authentication providers in Supabase dashboard

See the respective `.env.example` files for detailed variable descriptions.