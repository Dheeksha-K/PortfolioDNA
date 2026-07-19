# PortfolioDNA

AI-powered developer portfolio analyzer that delivers professional insights into UI, UX, branding, accessibility, and overall portfolio quality.

## Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Framer Motion — runs on port 5000 via Vite
- **Backend**: Node.js + Express 5 + Cheerio (HTML scraping) — runs on port 3001
- Vite proxies `/api/*` requests to the Express server during development

## Project Structure

```
server/
  src/
    index.ts           # Express entry point (port 3001)
    routes/analyze.ts  # POST /api/analyze route
    services/analyzer.ts  # Core HTML scraping & analysis engine
    types/analysis.ts  # Shared TypeScript types

client/
  src/
    App.tsx            # Root component, manages view state
    components/
      layout/          # Navbar, Footer
      landing/         # Hero, Features, HowItWorks, About
      report/          # All report section cards
    lib/
      api.ts           # analyzePortfolio() fetch wrapper
      utils.ts         # Helpers: cn, scoreColor, etc.
    types/analysis.ts  # TypeScript types (mirrors server types)
```

## Running Locally

The `PortfolioDNA` workflow runs both processes via `npm run dev` (concurrently):
- Vite dev server on port 5000 (what users see)
- Express API server on port 3001 (proxied by Vite)

## Key Design Decisions

- All analysis is server-side: the Express backend fetches and parses external URLs with axios + cheerio
- No fake data: scores are calculated from measurable HTML criteria only; if something can't be determined, it says so
- No auth, no history: reports are session-only per spec
- Portfolio detection: heuristic-based using keyword scoring and domain blocklist

## User Preferences

- Dark, minimal aesthetic inspired by Linear / Vercel / Raycast
- No neon, no glassmorphism overload
- All analysis must be real — never fabricated
