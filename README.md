# 🏆 LuxeSport — Premium Sports Equipment Catalog

A full-stack, production-ready sports equipment e-commerce catalog built with **Next.js 16**, **Prisma/SQLite**, and **NextAuth.js**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6.x-blue?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## ✨ Features

- **1,950+ Products** across 39 sports categories (Cricket, Football, Boxing, Gym, Swimming, etc.)
- **Advanced Filtering** — Filter by category, color, and price range on the `/shop` page
- **User Authentication** — Secure registration & login with bcrypt password hashing
- **Shopping Cart** — Persistent cart with Zustand (survives browser refresh)
- **WhatsApp Checkout** — Auto-generates formatted order messages for WhatsApp
- **Admin CMS** — Role-protected dashboard for managing products (`/admin`)
- **User Profiles** — Edit name, phone, and change password
- **Responsive Design** — Mobile-first UI with Framer Motion animations
- **Hero Carousel** — Auto-advancing image slideshow on the homepage

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd website-project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and set a strong NEXTAUTH_SECRET:
# openssl rand -base64 32

# Initialize the database
npx prisma db push
npx prisma generate

# Seed with product data
npx tsx prisma/seed-massive.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 📁 Project Structure

```
website-project/
├── prisma/
│   ├── schema.prisma          # Database schema (Product, Category, User, etc.)
│   ├── seed-massive.ts        # Generates 1,950+ products
│   └── fill-categories.ts     # Category seeder
├── src/
│   ├── app/
│   │   ├── admin/             # Protected admin CMS dashboard
│   │   ├── api/auth/          # NextAuth.js API routes
│   │   ├── api/register/      # User registration endpoint
│   │   ├── api/profile/       # Profile read/update endpoint
│   │   ├── cart/              # Shopping cart page
│   │   ├── contact/           # Contact & inquiry form
│   │   ├── login/             # Login page
│   │   ├── profile/           # User profile management
│   │   ├── register/          # Registration page
│   │   ├── search/            # Product search
│   │   ├── shop/              # Master catalog with filters
│   │   └── sports/[sport]/    # Sport-specific product pages
│   ├── components/
│   │   ├── auth/              # AuthProvider (SessionProvider wrapper)
│   │   ├── home/              # Hero, CategorySection
│   │   ├── layout/            # Navbar, Footer
│   │   ├── product/           # ProductCard, ProductGrid, AddToCartButton
│   │   └── shop/              # ShopSidebar (filter panel)
│   ├── lib/                   # Database client, utilities, types
│   ├── store/                 # Zustand cart store
│   └── types/                 # TypeScript type declarations
├── .env.example               # Environment variable template
├── .gitignore
└── package.json
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXTAUTH_URL` | Your app's base URL (e.g., `https://yourdomain.com`) | ✅ |
| `NEXTAUTH_SECRET` | Random 32+ character secret for JWT signing | ✅ |
| `DATABASE_URL` | Database connection string | ✅ |

---

## 🛡️ Security

- Passwords are hashed with **bcrypt** (10 salt rounds)
- Admin routes are **server-side protected** — only users with `role: 'admin'` can access `/admin`
- **NEXTAUTH_SECRET** must be set via environment variable (no hardcoded fallbacks)
- Registration API never returns password hashes
- Error messages are generic to prevent information leakage

---

## 📦 Deployment

See `TECHNICAL_DOCS.md` for full deployment instructions to Vercel.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Full-stack React framework |
| Prisma 6.x | ORM & database management |
| SQLite | Development database |
| NextAuth.js 4 | Authentication |
| Zustand | Client-side state management (cart) |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| bcryptjs | Password hashing |

---

## 📄 License

Private project. All rights reserved.
