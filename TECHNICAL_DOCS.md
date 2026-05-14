# LuxeSport — Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Authentication Flow](#authentication-flow)
4. [API Reference](#api-reference)
5. [Security Measures](#security-measures)
6. [Deployment Guide](#deployment-guide)
7. [Admin Setup](#admin-setup)

---

## Architecture Overview

LuxeSport is a **server-side rendered** Next.js 16 application using the App Router pattern. It combines:

- **Server Components** for data-fetching pages (product listings, admin dashboard)
- **Client Components** for interactive UI (cart, filters, auth forms)
- **Server Actions** for form mutations (admin product CRUD)
- **API Routes** for REST endpoints (registration, profile management)

```
┌──────────────────────────────────────────────┐
│                   Browser                     │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ Zustand  │  │ NextAuth │  │ Framer      │ │
│  │ Cart     │  │ Session  │  │ Motion      │ │
│  └────┬─────┘  └────┬─────┘  └─────────────┘ │
└───────┼──────────────┼────────────────────────┘
        │              │
┌───────┼──────────────┼────────────────────────┐
│       ▼              ▼       Next.js Server    │
│  ┌─────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ API      │  │ Server   │  │ Server       │ │
│  │ Routes   │  │ Comps    │  │ Actions      │ │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘ │
│       └──────────────┴───────────────┘         │
│                      │                         │
│              ┌───────▼───────┐                 │
│              │  Prisma ORM   │                 │
│              └───────┬───────┘                 │
│                      │                         │
│              ┌───────▼───────┐                 │
│              │   SQLite DB   │                 │
│              └───────────────┘                 │
└────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Models

| Model | Purpose | Key Fields |
|---|---|---|
| **Category** | Product groupings (39 total) | `name`, `slug`, `imageUrl` |
| **Product** | Individual items (1,950+) | `name`, `brand`, `sport`, `price`, `color`, `slug`, `categoryId` |
| **User** | Registered accounts | `email`, `password` (hashed), `role`, `phone` |
| **Account** | NextAuth provider accounts | `provider`, `providerAccountId` |
| **Session** | Active user sessions | `sessionToken`, `expires` |

### Relationships
- `Category` → `Product` (one-to-many)
- `User` → `Account` (one-to-many)
- `User` → `Session` (one-to-many)

---

## Authentication Flow

```
Registration:
  Client → POST /api/register → bcrypt.hash(password) → prisma.user.create → auto-login via signIn()

Login:
  Client → NextAuth signIn('credentials') → prisma.user.findUnique → bcrypt.compare → JWT issued

Session Check:
  Every request → NextAuth middleware reads JWT → session.user available in components
```

### Role-Based Access
- `role: 'user'` — Standard customer (browse, cart, profile)
- `role: 'admin'` — Full CMS access (`/admin` route)

---

## API Reference

### `POST /api/register`
Creates a new user account.

| Field | Type | Required |
|---|---|---|
| `name` | string | ✅ |
| `email` | string | ✅ |
| `password` | string | ✅ (min 8 chars, 1 uppercase, 1 lowercase, 1 number) |

**Response:** User object (excluding password hash)

---

### `GET /api/profile`
Returns the authenticated user's profile data.

**Auth Required:** Yes (session-based)

**Response:** `{ id, name, email, phone, role, image }`

---

### `PUT /api/profile`
Updates the authenticated user's profile.

| Field | Type | Required |
|---|---|---|
| `name` | string | ❌ |
| `phone` | string | ❌ |
| `newPassword` | string | ❌ |

---

### `GET/POST /api/auth/[...nextauth]`
NextAuth.js handler. Manages login, logout, and session management.

---

## Security Measures

### ✅ Implemented
| Measure | Description |
|---|---|
| Password Hashing | bcrypt with 10 salt rounds |
| Admin Route Protection | Server-side session + role check on `/admin` |
| JWT Sessions | Stateless, signed with NEXTAUTH_SECRET |
| Input Validation | Client + server-side email/password validation |
| Safe Error Messages | Generic errors prevent information leakage |
| Environment Secrets | NEXTAUTH_SECRET loaded from env, no hardcoded fallbacks |
| Gitignored Secrets | `.env*`, `dev.db`, credentials never committed |

### ⚠️ Recommended for Production
| Measure | Action |
|---|---|
| Rate Limiting | Add rate limiting on `/api/register` and `/api/auth` to prevent brute-force |
| CSRF Protection | NextAuth handles this automatically for auth endpoints |
| HTTPS | Enforce HTTPS in production (Vercel does this by default) |
| PostgreSQL | Migrate from SQLite to PostgreSQL for concurrent access |
| Image Hosting | Move from Unsplash URLs to Cloudinary/S3 |
| Content Security Policy | Add CSP headers via `next.config.js` |

---

## Deployment Guide

### Option A: Deploy to Vercel (Recommended)

#### Step 1: Prepare the Repository
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Production-ready LuxeSport catalog"

# Push to GitHub
gh repo create luxesport --private --push
# Or add remote manually:
git remote add origin git@github.com:YOUR_USERNAME/luxesport.git
git push -u origin main
```

#### Step 2: Switch to PostgreSQL
SQLite doesn't work on Vercel's serverless environment. Use one of:
- **Vercel Postgres** (built-in, free tier available)
- **Supabase** (free tier, generous limits)
- **PlanetScale** (MySQL-compatible)
- **Neon** (serverless Postgres)

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed-massive.ts
```

#### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Set Environment Variables in Vercel dashboard:
   - `NEXTAUTH_URL` = `https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET` = (generate with `openssl rand -base64 32`)
   - `DATABASE_URL` = (your PostgreSQL connection string)
3. Click **Deploy**

#### Step 4: Create Admin User
After deployment, register a normal user, then manually update their role in the database:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```
Or use Prisma Studio:
```bash
npx prisma studio
```

---

### Option B: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

```bash
# On your server:
git clone <repo-url>
cd website-project
npm install
cp .env.example .env.local
# Edit .env.local with production values

npx prisma db push
npx prisma generate
npx tsx prisma/seed-massive.ts

npm run build
npm run start  # Runs on port 3000
```

Use **nginx** as a reverse proxy with SSL via **Let's Encrypt**.

---

## Admin Setup

To make a user an admin in production:

1. Register normally via `/register`
2. Access the database directly:
   ```bash
   npx prisma studio  # Opens web UI at localhost:5555
   ```
3. Find the user in the `User` table
4. Change their `role` from `user` to `admin`
5. They can now access `/admin`

> **Note:** There is no self-service admin promotion for security reasons.

---

## Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npx prisma studio` | Open database GUI |
| `npx prisma db push` | Sync schema to database |
| `npx prisma generate` | Regenerate Prisma client |
| `npx tsx prisma/seed-massive.ts` | Seed 1,950 products |
