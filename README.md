# KshemaNidhi UI

Frontend-only React + TypeScript + Vite + Tailwind CSS application for managing a family fund, loans, monthly member contributions, repayments and interest.

## Run

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run preview
```

## Architecture

The project is organized by feature instead of keeping business logic in `App.tsx`.

- `src/app` — application router and root
- `src/components/layout` — responsive shell/navigation
- `src/components/ui` — reusable UI primitives
- `src/features/dashboard` — dashboard UI and derived totals
- `src/features/loans` — loan pages, components, calculations and service layer
- `src/features/contributions` — monthly contributions feature
- `src/features/members` — member management
- `src/services/storage` — persistence adapter
- `src/services/api` — placeholder for a future backend client
- `src/store` — central application state
- `src/config` — values such as annual rate and monthly contribution
- `src/utils` — currency and date helpers

## Responsive behavior

- Mobile: stacked cards, mobile card versions of wide tables, fixed bottom navigation.
- Tablet/mid-size: two-column summary grids and full-width feature pages.
- Desktop: sticky left sidebar and multi-column feature layouts.
- Large desktop: capped content width (`1500px`) inside an `1800px` application shell so content does not stretch excessively.

## Backend migration later

UI components do not write directly to localStorage. State changes go through feature services and the storage adapter. A backend can later replace the persistence layer while keeping page/component APIs stable.

## Existing browser data

The storage adapter attempts to load older `family-loan-fund-v1` and `family-loan-fund-v2` data if the new `kshemanidhi-fund-v3` key is not present.
