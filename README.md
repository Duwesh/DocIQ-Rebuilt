# DocIQ — AI Document Intelligence Hub

> A multi-tenant document analysis platform powered by Next.js, Clerk, Prisma, Vercel Blob, and Google Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-blue?style=flat-square&logo=google)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwindcss)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)

---

## Features

### 🧠 AI Intelligence Pipeline
- **Multimodal PDF Analysis** — PDFs are sent as raw bytes to Gemini's inline multimodal API, not decoded as broken text. Analysis reads both the visual and text layers natively.
- **6 Analysis Protocols** — Summary, Sentiment, Q&A, Entity Extraction, Structured Extract, and Keyword Extraction.
- **Instant Analysis on Upload** — Summary and Sentiment are triggered automatically on every document upload.
- **Granular Status Tracking** — Each intelligence layer (Summary, Sentiment, Keywords) is tracked independently in the database and shown as individual status badges in the registry.

### 📁 Document Registry (`/dashboard/documents`)
- Real-time fuzzy search across document names and AI summaries.
- Multi-dimensional filtering by analysis status and file type.
- CSV export of all registry records.
- Keyword pills displayed inline under each document name.
- Per-document **Analyze / Re-analyze** dropdown with protocol selection.

### 🏢 Multi-Tenancy
- Clerk Organizations for isolated workspaces.
- Personal Library mode (`none_for_personal`) for users without an active org.
- Per-org document scoping on all API routes.

### 🖥️ UI/UX
- Premium "Neural Intelligence" design system with glassmorphism and dark theme.
- Outfit (headings) + Inter (body) typography via `next/font`.
- Animated micro-interactions and smooth transitions throughout.
- Responsive layout with mobile sidebar support.

---

## Analysis Types

| Protocol | Database Field | Description |
|---|---|---|
| `summary` | `aiSummary` | Comprehensive document summary with key points |
| `sentiment` | `sentiment` | JSON: overall tone, confidence, emotional tones |
| `keywords` | `aiKeywords` | Top 10 keyphrases as a string array |
| `qa` | `content` | 5 auto-generated Q&A pairs (JSON) |
| `entities` | `content` | Named entities: people, orgs, locations, dates |
| `extract` | `content` | Structured extraction: dates, numbers, action items |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Clerk (users + organizations) |
| Database | PostgreSQL via Prisma 7 |
| File Storage | Vercel Blob |
| AI | Google Gemini 2.0 Flash (multimodal) |
| UI | Radix UI + Tailwind CSS v4 |
| Icons | Lucide React |
| Toasts | Sonner |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Duwesh/DocIQ.git
cd DocIQ
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Vercel Blob
BLOB_READ_WRITE_TOKEN=...

# Google Gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
```

### 3. Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  api/
    analyze/       # AI analysis endpoint (multimodal PDF support)
    upload/        # File upload + instant AI analysis
    documents/     # CRUD for document registry
  dashboard/
    documents/     # Document registry page
    organization/  # Org overview page
  data/            # Analysis type definitions

components/
  document-table.tsx     # Registry table with granular status badges
  analysis-button.tsx    # Multi-protocol AI trigger dropdown
  registry-view.tsx      # Client-side search, filter, export
  upload-dialog.tsx      # Asset ingestion modal

lib/
  gemini.ts    # Gemini multimodal API integration
  db.ts        # Prisma client singleton

types/
  index.ts     # AnalysisType union + Document interface

prisma/
  schema.prisma  # Document model with aiSummary, sentiment, aiKeywords fields
```

---

## License

MIT
