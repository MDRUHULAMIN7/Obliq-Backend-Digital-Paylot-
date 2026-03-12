# Obliq RBAC Backend

Express + TypeScript backend for the RBAC system. Provides authentication, user management, permission management, and audit logging.

## Features
- JWT auth (access + refresh) with httpOnly cookies
- Refresh token blacklist (logout)
- Brute‑force login rate limiting
- Role hierarchy + grant ceiling enforcement
- Users CRUD + suspend/ban/status update
- Permission management (per‑user)
- Audit log for admin/manager actions

## Local Setup

### 1) Install dependencies
```bash
npm install
```

### 2) Environment variables
Create or edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_url
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SUPER_ADMIN_PASSWORD=admin1234
CLIENT_URLS=http://localhost:3000
```

### 3) Run dev server
```bash
npm run start:dev
```

API base URL: `http://localhost:5000/api/v1`

## Admin Credentials (Local)
Admin is auto‑seeded on first boot:
- **Email:** `admin@obliq.local`
- **Password:** value of `SUPER_ADMIN_PASSWORD`

## API Highlights
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`
- `PATCH /api/v1/users/:id/status`
- `PATCH /api/v1/users/:id/permissions`
- `GET /api/v1/audit`

## Production Deploy (Vercel)

This repo includes a Vercel serverless handler:
- `backend/api/index.ts`
- `backend/vercel.json`

**Backend Env Vars**
```env
NODE_ENV=production
DATABASE_URL=your_mongodb_url
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
SUPER_ADMIN_PASSWORD=change_me
CLIENT_URLS=https://your-frontend.vercel.app
```

Deploy the `backend` directory as a Vercel project.

## Project Structure (Backend)
```
src/
  app/
    modules/        # Auth, users, permissions, audit
    middleware/     # auth guards, rate limiter, error handlers
    utils/          # helpers, db connect
api/
  index.ts          # Vercel handler
```
