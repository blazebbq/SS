# PageNest

A production-ready multi-tenant SaaS platform for small businesses to create public business pages with online booking functionality.

## Features

- 🔐 **Authentication** – Email/password login with NextAuth v5
- 🏢 **Multi-tenant** – Each business gets its own page at `/{slug}`
- 📅 **Booking System** – Service, staff, date & time selection
- 🛡️ **Double-booking Prevention** – Server-side validation with DB transactions
- 📧 **Email Notifications** – Customer & owner confirmations via Resend
- 🎨 **10 Templates** – Barber, Salon, Fitness, Tattoo, Beauty, Clinic, Tradesperson, Photographer, Restaurant, Generic
- 💳 **Stripe Subscriptions** – Free/Pro/Business tiers (scaffolded)

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma 7** (PostgreSQL via Neon or self-hosted)
- **NextAuth v5**
- **Resend** (email)
- **Stripe** (subscriptions)

## Quick Start

### 1. Clone and install

```bash
git clone <repo>
cd pagenest
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Fill in your `.env`:
- `DATABASE_URL` – PostgreSQL connection string (Neon recommended)
- `NEXTAUTH_SECRET` – Random string: `openssl rand -base64 32`
- `RESEND_API_KEY` – From [resend.com](https://resend.com)
- `STRIPE_SECRET_KEY` – From [stripe.com](https://stripe.com)

### 3. Set up database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with demo data
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Demo Credentials

After seeding:
- **Email:** `demo@pagenest.uk` | **Password:** `password123`
- **Email:** `barber@pagenest.uk` | **Password:** `password123`

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | Sign up + create business |
| `/login` | Sign in |
| `/dashboard` | Business overview |
| `/dashboard/services` | Manage services |
| `/dashboard/staff` | Manage team |
| `/dashboard/hours` | Set opening hours |
| `/dashboard/bookings` | View & manage bookings |
| `/dashboard/settings` | Business info + template |
| `/dashboard/billing` | Subscription management |
| `/[slug]` | Public business page |

## Templates

| # | Name | Style |
|---|------|-------|
| 1 | Barber | Dark, bold, yellow accents |
| 2 | Hair Salon | Clean, feminine, rose tones |
| 3 | PT / Fitness | Energetic, orange |
| 4 | Tattoo Studio | Dark minimal, zinc |
| 5 | Beauty / Nails | Soft pastel, pink |
| 6 | Clinic / Aesthetic | Clinical clean, teal |
| 7 | Tradesperson | Simple, blue + yellow |
| 8 | Photographer | Image-heavy, stone tones |
| 9 | Restaurant | Menu style, red + amber |
| 10 | Generic Business | Clean, indigo fallback |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| GET/PATCH | `/api/business` | Get/update business |
| POST | `/api/business/services` | Add service |
| PATCH/DELETE | `/api/business/services/[id]` | Update/delete service |
| POST | `/api/business/staff` | Add staff |
| PATCH/DELETE | `/api/business/staff/[id]` | Update/delete staff |
| PATCH | `/api/business/hours` | Update opening hours |
| GET/POST | `/api/business/blocked-times` | Manage blocked times |
| DELETE | `/api/business/blocked-times/[id]` | Delete blocked time |
| GET | `/api/bookings` | List bookings (with filters) |
| PATCH | `/api/bookings/[id]` | Update booking status |
| GET | `/api/availability` | Get available time slots |
| GET | `/api/public/[slug]` | Public business data |
| POST | `/api/public/[slug]/book` | Create booking |
| POST | `/api/stripe/checkout` | Create Stripe checkout |
| POST | `/api/stripe/webhook` | Stripe webhook handler |

## Deployment (Vercel)

1. Import repo to Vercel
2. Add environment variables
3. Deploy
4. Run migrations: `npx prisma migrate deploy`

## Database Schema

See `prisma/schema.prisma` for the complete schema with:
- `User` – Account owners
- `Business` – Business profiles
- `Service` – Bookable services
- `Staff` – Team members
- `Booking` – Customer appointments
- `OpeningHours` – Per-day availability
- `BlockedTime` – Blocked periods
- `GalleryImage` – Business gallery photos

The `Booking` model enforces `@@unique([staffId, startTime])` to prevent double-bookings at the database level.
