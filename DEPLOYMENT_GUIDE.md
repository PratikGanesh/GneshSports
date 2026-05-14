# 🚀 LuxeSport — Deployment Guide

Step-by-step instructions to deploy LuxeSport to production on **Vercel**.

---

## Prerequisites

- A **GitHub** account ([github.com](https://github.com))
- A **Vercel** account ([vercel.com](https://vercel.com)) — free tier is fine
- **Node.js** >= 18 installed locally
- Your project code ready and working locally

---

## Step 1: Push Code to GitHub

Open your terminal and run:

```bash
cd /Users/siddharthpatel/Documents/Siddharth/WebsiteProject/website-project

# Stage all files
git add .

# Commit
git commit -m "Production-ready LuxeSport catalog"
```

### Create a GitHub Repository

**Option A — Using GitHub CLI (if installed):**
```bash
gh repo create luxesport --private --push
```

**Option B — Manual:**
1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `luxesport` (Private recommended)
3. Run:
```bash
git remote add origin git@github.com:YOUR_USERNAME/luxesport.git
git push -u origin main
```

✅ **Checkpoint:** Your code should now be visible on GitHub.

---

## Step 2: Set Up a PostgreSQL Database

> ⚠️ **Why?** SQLite (what we use locally) does **not** work on Vercel's serverless platform. You need PostgreSQL.

### Recommended: Supabase (Free Tier — 500 MB)

1. Go to [supabase.com](https://supabase.com) → **Start your project**
2. Sign up with GitHub
3. Click **New Project**
   - Name: `luxesport`
   - Database Password: (save this somewhere safe!)
   - Region: Choose closest to your users
4. Wait for project to finish setting up (~2 minutes)
5. Go to **Settings** → **Database** → **Connection string** → **URI**
6. Copy the connection string. It looks like:
   ```
   postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
7. Replace `[PASSWORD]` with the password you set

### Alternative Options

| Provider | Free Tier | Website |
|---|---|---|
| Vercel Postgres | 256 MB | Built into Vercel dashboard |
| Neon | 512 MB | [neon.tech](https://neon.tech) |
| PlanetScale | 5 GB (MySQL) | [planetscale.com](https://planetscale.com) |

✅ **Checkpoint:** You should have a PostgreSQL connection string saved.

---

## Step 3: Update Prisma for PostgreSQL

Open `prisma/schema.prisma` and change the datasource block:

### Before (SQLite):
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### After (PostgreSQL):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Push Schema & Seed Data to Production Database

Run these commands in your terminal:

```bash
# Set the production database URL temporarily
export DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"

# Create all tables on the remote database
npx prisma db push

# Seed the 1,950 products
npx tsx prisma/seed-massive.ts

# Verify it worked
npx prisma studio
```

Prisma Studio will open at `http://localhost:5555` — you should see all your products in the remote database.

✅ **Checkpoint:** Your PostgreSQL database has all 1,950+ products and 39 categories.

---

## Step 4: Deploy on Vercel

### 4.1 — Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** → **Continue with GitHub**
3. Click **Add New Project**
4. Find and select your `luxesport` repository
5. Click **Import**

### 4.2 — Set Environment Variables

On the deployment configuration page, expand **Environment Variables** and add:

| Variable Name | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string from Step 2 |
| `NEXTAUTH_URL` | `https://luxesport.vercel.app` (will update after deploy) |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |

To generate your secret, run this in terminal:
```bash
openssl rand -base64 32
```
Copy the output and paste it as the `NEXTAUTH_SECRET` value.

### 4.3 — Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for the build to complete
3. Vercel will give you a URL like `https://luxesport-abc123.vercel.app`

✅ **Checkpoint:** Your site is live! Visit the URL and verify the homepage loads.

---

## Step 5: Create Your Admin User

1. Visit your live site → go to `/register`
2. Create an account with your email and a strong password
3. Go to your **Supabase** dashboard → **SQL Editor** → Run:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

4. Now visit `/admin` on your live site — you should have full CMS access!

✅ **Checkpoint:** You can log in and access the Admin Dashboard.

---

## Step 6: Update NEXTAUTH_URL (Final)

After deployment, update the URL to match your actual domain:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Edit `NEXTAUTH_URL` and set it to your actual live URL:
   - If using Vercel default: `https://your-project-name.vercel.app`
   - If using custom domain: `https://yourdomain.com`
3. Go to **Deployments** → Click **⋮** on latest → **Redeploy**

---

## (Optional) Step 7: Add a Custom Domain

1. In Vercel Dashboard → **Settings** → **Domains**
2. Click **Add** → Enter your domain (e.g., `luxesport.in`)
3. Vercel will give you DNS records to add at your domain registrar:
   - **Type:** CNAME
   - **Name:** `@` or `www`
   - **Value:** `cname.vercel-dns.com`
4. Wait 5-30 minutes for DNS propagation
5. Update `NEXTAUTH_URL` to `https://luxesport.in`
6. Redeploy

---

## Troubleshooting

### Build fails with Prisma error
```bash
# Make sure prisma generate runs during build
# Add to package.json scripts:
"postinstall": "prisma generate"
```

### "NEXTAUTH_SECRET missing" error
- Double check your environment variable is set in Vercel Dashboard
- Make sure there are no extra spaces or quotes in the value

### Database connection timeout
- Supabase: Make sure you're using the **pooled** connection string (port 6543, not 5432)
- Check that your connection string password doesn't contain special characters that need URL encoding

### Products not showing
- Verify you ran `npx tsx prisma/seed-massive.ts` with the production `DATABASE_URL`
- Check Prisma Studio or Supabase Table Editor to confirm data exists

---

## Post-Deployment Checklist

- [ ] Site loads at production URL
- [ ] Homepage carousel displays images
- [ ] `/shop` page shows products with working filters
- [ ] User registration works at `/register`
- [ ] User login works at `/login`
- [ ] Add to Cart works on product pages
- [ ] Cart page shows items at `/cart`
- [ ] Admin dashboard accessible at `/admin` (admin user only)
- [ ] Profile page works at `/profile`
- [ ] WhatsApp inquiry link works from product pages
- [ ] HTTPS is active (green lock icon in browser)

---

## Quick Reference

| What | Where |
|---|---|
| **Live Site** | `https://your-project.vercel.app` |
| **Admin Panel** | `https://your-project.vercel.app/admin` |
| **Vercel Dashboard** | [vercel.com/dashboard](https://vercel.com/dashboard) |
| **Supabase Dashboard** | [supabase.com/dashboard](https://supabase.com/dashboard) |
| **Redeploy** | Vercel Dashboard → Deployments → Redeploy |
| **Env Variables** | Vercel Dashboard → Settings → Environment Variables |

---

*Last updated: April 10, 2026*
