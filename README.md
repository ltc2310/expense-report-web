# Expense report webview - Clean Architecture (React)

Displays the weekly expense report chart. Opened from a link the Telegram
bot sends, in the form `https://your-webview.app?token=xxxx`.

## Folder structure (mirrors the backend's Clean Architecture)

```
src/
  domain/
    entities/WeeklySummary.ts     Types matching the backend API response
    ports/ReportRepository.ts     Interface: fetchReport(token)

  application/
    hooks/useWeeklyReport.ts      Use case: load + expose loading/error/success state

  infrastructure/
    api/HttpReportRepository.ts   Implements ReportRepository via fetch()

  presentation/
    components/                   TotalScreen, CategoryDonutChart, TransactionList
    pages/ReportPage.tsx          Composes the components based on hook state

  App.tsx                        Composition root: wires HttpReportRepository,
                                  reads ?token= from the URL
```

Same dependency rule as the backend: `domain` depends on nothing,
`application` only depends on `domain`, `infrastructure` implements
`domain`'s ports, and `App.tsx` is the only file that "new"s a concrete
repository.

## Status - what this covers right now

- [x] Fetches a weekly report from `GET {VITE_API_BASE_URL}/api/report?token=...`
- [x] Renders total spent, a category donut chart, and an itemized transaction list
- [x] Loading / error / empty states
- [ ] **Not built yet**: the backend `/api/report` endpoint itself, and the
      token generation/verification (see "Backend requirements" below) -
      this frontend expects that API to already exist

## Backend requirements (not part of this repo)

This app expects the bot backend to expose:

```
GET /api/report?token=<token>
```

Returning JSON shaped like:
```json
{
  "total": 450000,
  "byCategory": [{ "category": "ăn uống", "total": 300000 }],
  "transactions": [
    { "amount": 50000, "category": "ăn uống", "note": "ăn trưa 50k", "createdAt": "2026-07-08T12:00:00Z" }
  ]
}
```

The `token` should be a signed/expiring token tied to a user (not a raw
`user_id`) so a guessed number can't expose someone else's spending data.

## How to run locally

```bash
npm install
cp .env.example .env
# edit .env, set VITE_API_BASE_URL to your backend's URL
npm run dev
```

Open the URL Vite prints, with a token in the query string, e.g.:
`http://localhost:5173/?token=test123`
(it will show the error state until the backend endpoint exists and
recognizes that token)

## Build for production

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages,
or even served as static files from the same Render service as the bot).
