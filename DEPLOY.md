# ResuAI Deployment Guide (Free-tier friendly)

This guide shows how to deploy the frontend and backend using popular free-tier services, set up databases, storage, queues, and monitoring.

## Overview
- Frontend: Vercel (or Netlify)
- Backend/API: Render (or Railway/Fly.io)
- Database: MongoDB Atlas Free (or self-hosted Mongo via Railway)
- Object Storage: Cloudflare R2
- Queue: Upstash Redis + BullMQ worker
- Monitoring/Logs: Sentry + provider logs
- Payments: Razorpay (India)

## 1) Repos and environment
Create two environment files from examples.
- backend: copy `.env.example` to `.env`
- frontend: create `.env`

Frontend `.env`:
```
VITE_API_BASE_URL=https://<your-backend-host>
VITE_SENTRY_DSN=
```

Backend `.env`:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<atlas-connection-string>
ALLOW_DEV_FEATURES=false
SENTRY_DSN=<optional>
# AI Keys
OPENAI_API_KEY=
GEMINI_API_KEY=
# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
# R2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_REGION=auto
R2_ENDPOINT=https://<accountID>.r2.cloudflarestorage.com
R2_PUBLIC_BASE_URL=https://<your-r2-public-domain>
# Redis
REDIS_URL=rediss://:<password>@<host>:<port>
QUEUE_PREFIX=resuai
QUEUE_CONCURRENCY=5
WORKER_QUEUES=default
WORKER_LOG=false
```

Never commit `.env` files. Configure environment variables in hosting dashboards.

## 2) MongoDB Atlas
- Create a free cluster.
- Add database user and IP allowlist (0.0.0.0/0 for initial testing).
- Copy connection string into `MONGODB_URI`.

## 3) Cloudflare R2
- Create R2 bucket.
- Create API token with R2 access.
- Set `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ACCOUNT_ID`.
- Optional public access: create a public domain or serve through Workers; set `R2_PUBLIC_BASE_URL`.

## 4) Upstash Redis
- Create a free Redis database.
- Copy `REDIS_URL`.

## 5) Backend on Render
- New Web Service from GitHub repo.
- Build Command: `npm i && npm run build || npm i` (build not required here).
- Start Command: `npm run start`.
- Node version: 20.x
- Set environment variables per `.env` above.
- Expose port 5000.

### Worker on Render
- Create a Background Worker on the same repo.
- Start Command: `npm run worker`.
- Same environment as backend.

## 6) Frontend on Vercel
- Import the repo.
- Root: `frontend`
- Install Command: `npm i`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variables: `VITE_API_BASE_URL`, `VITE_SENTRY_DSN`.

## 7) DNS and SSL
- Vercel and Render provide HTTPS automatically.
- For R2 public access, configure a custom domain and SSL per Cloudflare docs.

## 8) CI via GitHub Actions
- Node workflow runs lint and can build-check both apps.
- On push to main/PR, it ensures the code is healthy.

## 9) Local dev
- MongoDB: local or Docker `mongo:7` mapped to localhost:27017.
- Set `ALLOW_DEV_FEATURES=true` to bypass paid gates for testing.
- Start backend: `npm run dev`. Start worker: `npm run worker`.
- Start frontend: `npm run dev`.

## 10) Troubleshooting
- Sentry DSN empty → no telemetry, but app still runs.
- AI keys missing → fallbacks used; some AI features degrade.
- Redis missing → queue endpoints return `queue_not_configured`.
- R2 missing → ops routes return `r2_not_configured`.

## 11) Security
- Keep secrets in platform env, not in Git.
- Use HTTPS URLs.
- Restrict CORS in production to frontend domain.

## 12) Post-deploy checks
- GET `/api/health`: `{ ok: true }`
- Templates generate & image endpoints respond 200.
- Payments order and verify (use Razorpay test keys).
- Worker logs show jobs processed when enqueued.
