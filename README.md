# KshemaNidhi frontend

React, TypeScript, Vite, and Tailwind UI for the family fund. Python API repository: https://github.com/ashwin-dev0/KshemaNidhi-backend

## Local development

```powershell
npm.cmd ci
npm.cmd run dev
```

Run the Python backend separately. Copy `.env.example` to `.env` and configure `API_PROXY_TARGET` for the backend address (default `http://127.0.0.1:8000`). Restart Vite after changing it. The browser always requests `/api`; Vite proxies these requests locally. Sign in using the account created or imported in the backend.

## Build

```powershell
npm.cmd run build
```

## Vercel deployment

Import this repository with the Vite preset, build command `npm run build`, and output directory `dist`. Deploy the backend separately first. Add a rewrite for `/api/:path*` to `https://YOUR-BACKEND-DOMAIN/api/:path*` before the existing SPA fallback in `vercel.json`, replacing the placeholder with the actual backend URL. `API_PROXY_TARGET` is only for local development/preview and does not configure production forwarding.

Set the backend `ALLOWED_ORIGINS` to your actual frontend origin and `COOKIE_SECURE=true`. Keep API requests on the frontend domain via the rewrite so authentication cookies work. Never put database credentials into this repository or any VITE_ environment variable. The database is managed only by the backend.

## Features

- Login and logout, including mobile bottom navigation.
- Outstanding/completed loans and repayment tracking.
- Monthly contributions and confirmation dialogs.
- Active/inactive members with retained history.
- Dashboard balances and interest breakdown.

All records are loaded from the backend API. Browser storage is not the source of truth.
