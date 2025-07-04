# Cover Letter Generator – Next.js Development Documentation (English Site)

## 1. Project Overview

**Goal**: Build an English‑only, AI‑powered cover‑letter generator that delivers SEO‑optimised, fast, and accessible pages using the latest Next.js 14 App Router.

## 2. Technology Stack

| Layer       | Choice                             | Reason                                                                                                          |
| ----------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Frontend    | Next.js 14 (App Router) + React 18 | Server‑side & static rendering, route‑level metadata API, built‑in image optimisation, automatic code‑splitting |
| Styling     | Tailwind CSS + shadcn/ui           | Utility‑first workflow, accessible components, dark‑mode support                                                |
| State       | React Context + TanStack Query     | Simple global state + async caching                                                                             |
| AI          | OpenRouter API via edge functions  | Multiple model access, competitive pricing, OpenAI-compatible interface                                         |
| Backend API | tRPC (pages/api) or edge functions | Type‑safe calls, incremental adoption                                                                           |
| Database    | Neon Postgres                      | Serverless, branching, cost-effective                                                                           |
| Storage     | Neon Storage / R2                  | User PDFs, template assets                                                                                      |
| Deployment  | Vercel                             | First‑class Next.js hosting, preview URLs, edge runtime                                                         |
| CI/CD       | GitHub Actions                     | PR lint/test/deploy gates                                                                                       |

## 3. Local Environment Setup

1. **Prerequisites**: Node ≥20, pnpm, Git, VS Code.
2. **Clone & Install**:

```bash
pnpm install
```

3. **Env Vars** (`.env.local`):

- `OPENROUTER_API_KEY=`
- `NEON_DATABASE_URL=`
- `NEON_DATABASE_URL_UNPOOLED=` (for migrations)

4. **Dev Server**: `pnpm dev` → [http://localhost:3000](http://localhost:3000)

## 4. Repository Structure

```
📂 src
 ├─ app/            # App router pages & layouts
 │   ├─ (marketing)/ # Public pages (SSG)
 │   ├─ dashboard/   # Auth‑guarded area (SSR)
 │   └─ api/         # Route handlers (edge)
 ├─ components/      # Reusable UI
 ├─ lib/             # util functions (seo, ai, neon)
 ├─ styles/          # global.css, tailwind
 └─ content/         # MDX blog posts (for SEO)
public/              # OG images, robots.txt, favicon
scripts/             # one‑off tools (sitemap, rss)
```

## 5. Coding Standards

- **TypeScript strict** mode
- **ESLint** with `next` config + **Prettier**
- **Husky** pre‑commit: lint, type‑check
- Conventional Commits + semantic‑release

## 6. SEO Strategy (Built‑In)

### 6.1 Rendering Strategy

| Page Type           | Generation                                   | Reason                        |
| ------------------- | -------------------------------------------- | ----------------------------- |
| Home, pricing, blog | `generateStaticParams` + Static Export (SSG) | Fast, cache‑friendly          |
| Blog tag pages      | ISR (`revalidate: 60`)                       | Fresh content without rebuild |
| Generator dashboard | SSR at edge                                  | Personalised, not indexed     |

### 6.2 Metadata API Usage

```tsx
export const metadata = {
  title: `AI Cover Letter Generator – {{tagline}}`,
  description: 'Create tailored cover letters that beat ATS in seconds. Free templates included.',
  alternates: { canonical: 'https://clgenerator.com/' },
  openGraph: {
    images: '/og/hero.png',
    type: 'website',
  },
};
```

- **Dynamic title template** for long‑tail keywords.
- **Twitter Cards** via `twitter:` props.

### 6.3 Structured Data

Generate JSON‑LD via helper in `lib/seo.ts` for:

- `Article` (blog posts)
- `SoftwareApplication` (landing page)
- `BreadcrumbList` (marketing pages)

### 6.4 Sitemap & Robots

- `scripts/generate-sitemap.ts` runs post‑build, pushes `/public/sitemap.xml`.
- `robots.txt` disallows `/dashboard/*`.

### 6.5 Core Web Vitals

- Next.js Image component + AVIF/WebP.
- Route‑based code‑splitting; lazy import Editor.
- Use `next/script` to defer 3rd‑party.

### 6.6 Content Plan

- **Pillar page**: "How to write a cover letter in 2025".
- 30+ MDX posts targeting `{role} cover letter examples`.
- Weekly build triggers ISR + RSS feed.

## 7. Authentication & Authorisation

- Custom auth with Neon database (JWT + sessions).
- Middleware: protect `/dashboard/*`; redirect 307 if unauthenticated.

## 8. AI Generation Workflow

1. Client posts JD + profile → `/api/generate` (edge).
2. Function calling schema splits into outline → intro → body → closing.
3. Stream tokens to React component via Fetch‑ReadableStream.
4. Save version & metrics to Postgres.

## 9. PDF Export

- Use `@react-pdf/renderer` in a server action to produce PDF.
- Store file in Neon Storage; return signed URL.

## 10. Testing

- **Unit**: Vitest + React Testing Library.
- **E2E**: Playwright (Chrome + Mobile viewport).
- **Lighthouse CI**: budgets (<2.5 s LCP).

## 11. Monitoring & Analytics

- Vercel Analytics + Speed Insights.
- Sentry (browser + server) with release tracking.
- Umami self‑hosted for privacy‑friendly metrics.

## 12. Security & Compliance

- HTTPS enforced; HTTP6 Strict‑Transport‑Security header.
- Content Security Policy via `next-secure-headers`.
- GDPR: cookie banner (client‑side consent), data deletion endpoint.
- Rate limiting on `/api/generate` with KV store.

## 13. Deployment Pipeline

1. PR → GitHub Actions: lint, test, type‑check.
2. On `main` merge: build → push to Vercel.
3. After deploy: `POST /revalidate` blog pages.
4. Slack webhook for status + core vitals diff.

## 14. Rollout & Versioning

- **Staging** environment at `staging.clgenerator.com`.
- Canary releases via Vercel "Preview Deployment Promotion".
- Semantic Versioning (`1.0.0` stable launch).

## 15. Roadmap Snapshot

| Quarter | Feature                   | KPI                   |
| ------- | ------------------------- | --------------------- |
| Q3 2025 | MVP live, 10 blog posts   | 1 k organic visits/mo |
| Q4 2025 | ATS score, export history | 100 paying subs       |
| Q1 2026 | Bulk generation API       | Edge AI latency <1 s  |

---

_Last updated: 2025‑07‑03_
