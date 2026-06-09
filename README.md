# CTO Advisory Dashboard

**Portfolio demo** -- fractional CTO dashboard for tech strategy and roadmap planning.

## The fractional CTO pain point

Fractional CTOs walk into engagements with limited context. They need to rapidly assess a company's tech stack, understand past architectural decisions, evaluate team health, and chart a strategic roadmap -- all while building trust with stakeholders. Most engagements start with scattered spreadsheets, stale Confluence pages, and gut-feel assessments. Missing context leads to duplicated effort, overlooked risk, and slow stakeholder alignment.

This dashboard solves that by providing a single-pane-of-glass view of the technical landscape: architecture decision records (ADRs), tech stack assessments with proficiency scoring, multi-quarter roadmap tracking, team health metrics, and engineering KPIs with trend indicators.

## Features

- **Architecture Decision Records (12 ADRs)** -- track tech decisions with status, impact level, and lineage (superseded-by chain)
- **Tech Stack Radar (8 assessments)** -- verdict-based technology evaluation (adopt / trial / assess / hold) with team proficiency scoring and migration cost
- **Roadmap Timeline (6 quarters)** -- phased initiatives with progress bars, risk levels, owner assignment, and dependency tracking
- **Team Health Dashboard (8 metrics)** -- sprint velocity, cycle time, change failure rate, incident MTTR, developer satisfaction, test coverage, onboarding time, code review turnaround -- each with benchmark comparisons and trend indicators
- **Engineering KPI Cards (6 KPIs)** -- deployment frequency, lead time, incident count, tech debt ratio, security vulnerabilities, API latency -- each with sparkline history, target-vs-actual, and trend
- **Pure Next.js + TypeScript** -- no external backend, no database, no API keys; everything runs from static demo data

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **Testing:** Vitest 4
- **Linting:** ESLint 9 + next/core-web-vitals

## Quick start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run all gates
npm run lint && npm run typecheck && npm test && npm run build
```

## Project structure

```
src/
  app/
    layout.tsx      # Root layout with metadata
    page.tsx        # Main dashboard page
    globals.css     # Tailwind directives + design tokens
  lib/
    types.ts        # TypeScript interfaces for all data models
    demo-data.ts    # Static demo data (12 ADRs, 8 tech assessments, 6-quarter roadmap, 8 health metrics, 6 engineering KPIs)
tests/
  cto.test.ts       # 12 vitest data integrity checks
```

## Demo data

All data is fictional and self-contained. No network calls, no environment variables, no database. The dashboard renders entirely from `src/lib/demo-data.ts`.

## Gates

| Gate | Command | Description |
|------|---------|-------------|
| Lint | `npm run lint` | ESLint with zero-warning tolerance |
| Typecheck | `npm run typecheck` | TypeScript strict mode, noEmit |
| Test | `npm test` | Vitest data integrity suite |
| Build | `npm run build` | Production Next.js build |

Run all four sequentially:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## License

Portfolio demonstration only. Not intended for production deployment.
