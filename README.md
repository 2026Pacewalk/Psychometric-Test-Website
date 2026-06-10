# MindMetric — Psychometric Test Website

A complete, production-ready psychometric assessment platform for school students:
marketing site, school login panel, bilingual (English & Punjabi) student test, automated
report generation with charts, and a role-based super-admin dashboard.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · Recharts · SheetJS**.

---

## Quick Start

```bash
npm install
npm run setup     # generates Prisma client, creates the SQLite DB, seeds data
npm run dev       # http://localhost:3000
```

> `npm run setup` = `prisma generate` + `prisma db push` + seed.
> To wipe and reseed: `npm run db:reset`.

### Demo credentials

| Role        | URL             | Login                                   |
|-------------|-----------------|-----------------------------------------|
| Super Admin | `/admin/login`  | `admin@mindmetric.in` / `admin123`      |
| School      | `/school-login` | code `DEMO01` / `school123`             |

---

## What's included

### Public website (SEO-friendly URLs, mobile responsive)
`/` Home · `/about` · `/why-psychometric` · `/government-awareness` ·
`/benefits-schools` · `/benefits-students` · `/sample-report` (live!) ·
`/test-process` · `/how-to-enroll` (lead form) · `/contact` (lead form) · `/school-login`.

A floating **WhatsApp** button with a pre-filled message appears site-wide.

### Student test flow
1. School adds a student and clicks **Start Test** → gets a unique secure link (`/test/<token>`).
2. Student confirms personal details, then answers **50 statements** (1–5 scale) in **English or Punjabi**.
3. On submit the **scoring engine** computes results and a multi-page report is generated.
4. Report (`/report/<token>`) is printable / save-as-PDF, with charts and bilingual content.

### Report contents (`src/components/report/ReportView.tsx`)
Profile · 12 Core Life Skills table + bar chart · soft-skills theory · category radar ·
10 category scores · RIASEC pie + career suggestions · per-skill definition/value/potential
pages · potential pie · complete skill grid · final counsellor recommendation.

### School dashboard (`/dashboard`)
Overview stats · student management · start/share tests · reports with filtering
(class, date, name, score, category) · **Excel export** · print · profile & password.

### Super-admin dashboard (`/admin`)
Schools (CRUD + status workflow) · all students · all results (+ Excel export) ·
questions & scoring logic (skill mapping, reverse, active) · RIASEC career suggestions ·
website content · leads/inquiries · admin users with **role-based permissions**.

---

## Scoring model

See `src/lib/skills.ts` (definitions) and `src/lib/scoring.ts` (engine).

- **12 skills**, each scored out of 25 from its mapped questions (admin-editable).
  Status: Highly Dominant (20+), Dominant (16–20), Less Dominant (11–15), Need Attention (0–10).
- **6 RIASEC** types, each averaged from 5 skills, shown as %.
- **10 categories** (Behaviour, Stability, Personality, Life Style, Future, Creative, Academic,
  Identity, Intrapersonal, NextGen) scored out of 100.

The 50 bilingual questions and their skill mapping are seeded in `prisma/seed.ts`
and editable from **Admin → Questions & Scoring**.

---

## Configuration (`.env`)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="<change in production>"
NEXT_PUBLIC_WHATSAPP_NUMBER="919041997889"
NEXT_PUBLIC_SITE_NAME="MindMetric"
```

## Production

```bash
npm run build
npm start
```

Deploy anywhere that runs Node (VPS, Render, Railway). For Vercel, switch the Prisma
datasource to PostgreSQL (SQLite is file-based). Always set a strong `JWT_SECRET`.

## Tech notes
- Auth: JWT in an httpOnly cookie (`jose`), bcrypt password hashing, route protection via middleware.
- PDF: report pages are print-optimised (A4) — use the browser's **Print → Save as PDF**.
- Excel: generated server-side with SheetJS.
