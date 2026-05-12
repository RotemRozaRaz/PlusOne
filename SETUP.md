# Plus One — Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
# Fill in your Supabase credentials and choose an ADMIN_PASSWORD
```

## 4. Run the database schema

Open the **Supabase SQL Editor** and run the entire contents of:

```
supabase/schema.sql
```

This creates the `users`, `likes`, `matches` tables, the `try_create_match` stored
procedure, RLS policies, and enables Realtime on the `matches` table.

## 5. Create the Storage bucket

In the Supabase Dashboard → **Storage**:
1. Click **New bucket**
2. Name: `photos`
3. Toggle **Public bucket** → ON
4. Save

The SQL in `schema.sql` already added the storage policies.

## 6. Enable Realtime

In the Supabase Dashboard → **Database → Replication**:
- Enable the `matches` table under the **supabase_realtime** publication.

(The schema.sql `ALTER PUBLICATION` line may handle this, but verify in the UI.)

## 7. Start the dev server

```bash
npm run dev
# → http://localhost:3000
```

## 8. Test the flow

| Test | Expected |
|------|----------|
| Open `http://localhost:3000` in an incognito window | Redirects to `/onboard` |
| Complete onboarding | Photo uploaded; redirected to `/swipe` |
| Open a second incognito window, complete onboarding | Two profiles visible |
| Both users swipe right on each other | `MatchOverlay` appears on both screens |
| Browse `/singles` | Masonry grid of all active guests |
| Visit `/admin` | Redirected to `/admin/login` |
| Enter `ADMIN_PASSWORD` | Admin table visible |

## URL Map

| Route | Description |
|-------|-------------|
| `/` | Auto-redirects based on device profile |
| `/onboard` | 3-step onboarding wizard |
| `/swipe` | Tinder-style card stack |
| `/singles` | Browse all guests |
| `/matches` | Your mutual matches |
| `/admin` | Protected admin panel |
| `/admin/login` | Admin password gate |
