# Jules Rukundo — Houdini FX Artist Portfolio

Live: https://vfx-portfolio-ecru.vercel.app

A cinematic dark/neon portfolio for Jules Rukundo, FX artist (SideFX Houdini + Nuke) based in Kigali, Rwanda — pyro, destruction, FLIP fluids, particles and cloth.

## Stack
- **Next.js 14** (App Router) · React 18 · Framer Motion · Lucide icons
- **Vanilla CSS** with CSS Modules
- **Supabase** (optional) — in-page admin editing of hero / about / skills / projects / services / contact
- Deployed on **Vercel**

## Content
All site content lives in **`lib/content.js`** — name, bio, skills, featured works, services, links.
Edit that one file to change what the site says. Media (clips, posters, photo, OG image) is in `public/media/`.

If Supabase is configured and an admin has saved edits through the site's "System Access" editor, those override the defaults from `lib/content.js`.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Environment (all optional)
Copy `.env.example` to `.env.local`. The site works with none of them set:
- **Contact form** — works out of the box via FormSubmit (the first message triggers a one-time
  activation email to the inbox; click Activate once). Or set `WEB3FORMS_ACCESS_KEY` from web3forms.com.
- **Supabase** — only needed for the admin editor. Run the SQL in `supabase/` to create the tables.

## Adding a project
1. Drop the clip + a poster still into `public/media/` (mp4, ≤ ~10 MB; poster jpg).
2. Add an entry to `projects` in `lib/content.js` (`id` becomes the URL: `/projects/<id>`).
3. Tag it with `categories` matching skill ids so it appears on the skill pages.

## Structure
- `app/` — pages, layout (SEO metadata, JSON-LD), `robots.js`, `sitemap.js`, contact API route
- `components/` — Nav, Hero, About, Skills, Projects, Services, Contact (+ admin editor UI)
- `lib/content.js` — **all copy and links**
- `lib/supabase.js` — Supabase client (mock client when not configured)
- `supabase/` — SQL schemas for the optional admin editor
