# Backend Deployment Guide

## Migration System

The backend uses a simple SQL-based migration system to handle database schema changes during deployment.

### Migration Commands

- **Local Development**: `pnpm db:migrate:dev`
- **Production**: `pnpm db:migrate:prod` (automatically called during build)

### Environment Variables for Migrations

Production deployments should set:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

Railway automatically provides this environment variable.

### Deployment Process

**Option 1: Automatic migrations with start:prod (Recommended)**
```bash
# 1. Build the application
pnpm build:prod

# 2. Start with automatic migrations (migrations run before app starts)
pnpm start:prod
```
> The `prestart:prod` script automatically runs migrations before starting the app

**Option 2: Manual deployment process**
```bash
# 1. Build the application
pnpm build:prod

# 2. Run database migrations
pnpm db:migrate:prod

# 3. Start the application
NODE_ENV=production node dist/server.js
```

**Option 3: Using deploy command**
```bash
# 1. Build the application
pnpm build:prod

# 2. Deploy (runs migrations + starts app)
pnpm deploy
```

### Migration File

All migrations are contained in a single file: `database/run-migrations.sql`

### How Migrations Work

1. Single SQL file: `database/run-migrations.sql`
2. Uses PostgreSQL DO blocks for conditional logic
3. Creates `migrations` table to track applied migrations
4. Checks which migrations are already applied
5. Runs only new migrations
6. Each migration uses IF NOT EXISTS logic for safety

### Current Migrations

All migrations are contained in `database/run-migrations.sql`:
1. **001_create_migrations_table**: Creates the migrations tracking table
2. **002_migrate_topics_to_ids**: Converts topics from TEXT[] to UUID[]

### Adding New Migrations

1. Add a new DO block to `database/run-migrations.sql`
2. Use IF NOT EXISTS pattern to check if migration was applied
3. Add the migration name to the migrations table when complete
4. Test the migration locally first
5. Commit the updated file to version control

### Platform-Specific Deployment

**Vercel/Netlify/Railway:**
```json
// package.json scripts they'll call
{
  "build": "pnpm build:prod",
  "start": "pnpm start:prod"  // Automatically runs migrations via prestart:prod
}
```

**Docker:**
```dockerfile
# In your Dockerfile
RUN pnpm build:prod
CMD ["pnpm", "start:prod"]  # Migrations run automatically
```

**Manual/VPS:**
```bash
# SSH into your server
pnpm build:prod
pnpm start:prod  # Migrations run automatically
```

### Production Deployment Checklist

- [ ] Database credentials are configured as environment variables
- [ ] Application is built with `pnpm build:prod`
- [ ] Migrations run automatically with `pnpm start:prod` (via prestart:prod)
- [ ] Application starts successfully
- [ ] Health checks pass
- [ ] Rollback plan is ready

### Rollback Strategy

If a migration fails:
1. Check the migration logs for specific errors
2. The failed migration is automatically rolled back
3. Fix the migration file
4. Re-deploy with the corrected migration

### Monitoring

Migration logs include:
- List of applied migrations
- Progress of current migration run
- Success/failure status
- Detailed error messages for failures