# CineEchoes Actress League

A mobile-first viral voting app for Bollywood actress battles, built with Next.js 14 + Supabase.

## Features

- Battle voting between two actresses
- One vote per device per round
- Optional post-vote profile form
- Results page with winner badge + animated bars
- Share button for virality
- Password-protected admin dashboard (`/admin`) for:
  - round creation
  - image upload to Supabase Storage
  - ending rounds
  - vote count monitoring

## Stack

- Next.js 14 App Router
- React + TailwindCSS
- Supabase (PostgreSQL + Storage)
- Ready to deploy on Vercel

## 1) Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## 2) Supabase setup

1. Create a Supabase project.
2. Run SQL from `supabase/schema.sql` in Supabase SQL Editor.
3. Create a storage bucket named `actress-images` (or custom value from `SUPABASE_STORAGE_BUCKET`) and set it to public.
4. Add env vars from `.env.example`.

## 3) Deploy to Vercel

1. Push this repo to GitHub.
2. Import repo in Vercel.
3. Add all environment variables from `.env.example`.
4. Deploy.

## Performance notes

- Uses Next.js Image optimization (`next/image`) for battle cards.
- API routes handle vote logic server-side to keep client payload small.
- Mobile-first layouts with large tap targets for Instagram in-app browser.
