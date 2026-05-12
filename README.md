# Plus One

A wedding guest matchmaking app — swipe, match, and connect with other guests at the event. Built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Onboarding** — guests upload a photo and set their profile in a 3-step wizard
- **Swipe** — Tinder-style card stack to like or pass other guests
- **Real-time matches** — instant match overlay when both guests swipe right
- **Singles gallery** — browse all active guests in a masonry grid
- **Admin panel** — password-protected dashboard to manage guests
- **Animations** — smooth transitions powered by Framer Motion

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) — database, auth, storage, realtime
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- TypeScript

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In **Settings → API**, copy your Project URL and keys

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials and choose an `ADMIN_PASSWORD`.

### 4. Run the database schema

Open the **Supabase SQL Editor** and run the contents of `supabase/schema.sql`.

This creates the `users`, `likes`, and `matches` tables, the `try_create_match` stored procedure, RLS policies, and enables Realtime on the `matches` table.

### 5. Create the Storage bucket

In Supabase Dashboard → **Storage**:
1. Create a new bucket named `photos`
2. Enable **Public bucket**

### 6. Start the dev server

```bash
npm run dev
# → http://localhost:3000
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Auto-redirects based on device profile |
| `/onboard` | 3-step onboarding wizard |
| `/swipe` | Tinder-style card stack |
| `/singles` | Browse all guests |
| `/matches` | Your mutual matches |
| `/admin` | Protected admin panel |
| `/admin/login` | Admin password gate |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `ADMIN_PASSWORD` | Password for the admin panel |
