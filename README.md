# Liora Media

A full-service creative studio site: graphic design, photography, studio sessions,
camera & equipment rentals, campaign booking, and related media production services.

```
liora-media/
├── frontend/   React + Vite + Tailwind + Framer Motion (built as static files)
├── api/        Vercel serverless functions (contact + booking endpoints)
└── vercel.json Ties the two together into one deployment
```

This is a merged, single-deploy version of the original two-folder project.
The old Express + `better-sqlite3` backend has been replaced with Vercel
serverless functions backed by Supabase Postgres — `better-sqlite3` writes to a
local file, and serverless functions have no persistent disk, so a file-based
database would lose every submission between requests. Everything else
(all components, styling, animations) is unchanged.

## 1. Push to GitHub

```bash
cd liora-media
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Deploy on Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new). Vercel will
   read `vercel.json` automatically — no manual build settings needed.
2. Add a database: **Storage → Marketplace Database Providers → Supabase**
   (free tier available). This injects `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` env vars into your project automatically.
3. Add one more env var yourself, in **Project Settings → Environment
   Variables**:
   - `ADMIN_API_KEY` — any private string. Sent as the `x-admin-key` header
     to view submitted bookings/messages and to use `/admin`.
4. Open the Supabase project's **SQL Editor** and run the contents of
   `supabase-schema.sql` once. Unlike a plain Postgres setup, this project
   doesn't create tables automatically on first request — the schema (and
   the initial `site_content` row the CMS reads) has to exist before the
   API will work.
5. Deploy. The `site-media` Storage bucket used for image uploads (see
   below) is created automatically the first time an image is uploaded —
   no manual setup needed for that part.

**Endpoints** (served from the same domain as the site, under `/api`):

| Method | Path                | Purpose                                  | Auth              |
|--------|---------------------|-------------------------------------------|-------------------|
| GET    | `/api/health`        | Health check                              | —                 |
| POST   | `/api/contact`       | Submit a contact message                  | —                 |
| GET    | `/api/contact`       | List messages                             | `x-admin-key` header |
| POST   | `/api/bookings`      | Submit a booking request                  | —                 |
| GET    | `/api/bookings`      | List bookings                             | `x-admin-key` header |
| PATCH  | `/api/bookings/:id`  | Update booking status (pending/confirmed/declined/completed) | `x-admin-key` header |
| GET    | `/api/content`       | Read site content                         | —                 |
| PUT    | `/api/content`       | Save site content (from `/admin`)         | `x-admin-key` header |
| POST   | `/api/upload`        | Upload an image, returns its public URL   | `x-admin-key` header |

```bash
curl -H "x-admin-key: your-key" https://your-site.vercel.app/api/bookings
```

### Image uploads

The `/admin` Portfolio editor uploads images directly (drag a file in,
no need to host it elsewhere first). Files go to a public Supabase Storage
bucket called `site-media`, created automatically on first upload, and the
returned public URL is what gets saved into the site content. A plain URL
field is still there too, in case you'd rather link to an image hosted
somewhere else.

Two limits worth knowing:
- **3MB per file** — Vercel serverless functions cap request bodies at
  4.5MB, and base64-encoding an image inflates its size by about a third,
  so 3MB decoded is the largest file that reliably fits.
- Uploaded files are public once uploaded (anyone with the URL can view
  them) — fine for a portfolio image, not a place to put anything private.

To get email notifications on new bookings/messages, add
[nodemailer](https://nodemailer.com) (or an HTTP email API such as Resend —
anything that runs from a serverless function) inside `api/contact.js` and
`api/bookings.js` where noted.

## 3. Local development

```bash
npm install -g vercel   # if you don't have it
npm install              # installs api/ dependencies
cd frontend && npm install && cd ..
vercel link               # links this folder to your Vercel project
vercel env pull .env.development.local
vercel dev                # serves frontend + /api together on one port
```

`vercel dev` runs the frontend and the serverless functions side by side, so
the frontend's relative `/api/...` calls work exactly as they will in
production. No separate backend process to start.

## 4. Before going live

- Replace the placeholder Unsplash images in `frontend/src/lib/images.js`
  with Liora Media's real photography.
- Replace the placeholder address/phone/socials in
  `frontend/src/components/Contact.jsx`.
- Set a strong `ADMIN_API_KEY` in the Vercel dashboard.
- Point your custom domain at the Vercel project (Project Settings →
  Domains) once you have one.

## What's included

- **Hero** — a mosaic of studio/photography images that scroll-animates apart
  like camera shutter blades, revealing the site beneath it.
- **Services** — 9 services: graphic design, photography, studio sessions,
  camera & lens rentals, campaign/program booking, videography, post-production,
  social content, and podcast studio rental.
- **Portfolio** — animated hover gallery.
- **Studio/About** — team + stats.
- **Booking form** — full booking capture (service, date, time, message) saved
  to the database.
- **Contact form** — general inquiries saved to the database.
- Scroll-triggered reveal animations throughout, respecting
  `prefers-reduced-motion`.
