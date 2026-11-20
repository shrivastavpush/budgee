# Budgee Backend: Changes & Roadmap

Last updated: 2026-11-20. Scope: `backend/` (Express 5, Mongoose 9, JWT, ImageKit).
Status: changes below are written but **not yet run or linted** (deps not installed, local Node v16).

## 1. Done so far

### Performance
- `authMiddleware.protect`: stateless JWT check (HS256), no DB lookup per request.
- Dashboard: 6 aggregations reduced to 2 (one `$facet` per collection).
- `.lean()` on list, update, delete and getUser queries. Stable sort `{date:-1,_id:-1}`.
- Login: removed collation so the unique email index is used.
- Indexes `{userId, date:-1, amount:1}` on Income and Expense (dashboard totals served from the index).

### Reliability
- Duplicate email race returns 400 (Mongo code 11000).
- No `error.message` leaked to clients (register, login, getUser, upload).
- Malformed or oversized body and Multer errors return 400.
- Graceful shutdown (SIGTERM, SIGINT) closes HTTP, Mongo and Redis. Keep-alive timeouts at 65s/66s.
- `/health` endpoint checks Mongo connection.

### Scalability and security
- Mongo pool: `maxPoolSize` 50 (`MONGO_MAX_POOL`), `minPoolSize` 5, timeouts.
- JSON body limit 10kb, `x-powered-by` disabled.
- Rate limits: auth 20 failed per 15 min, API 600 per 15 min, upload 10 per hour. Redis store when `REDIS_URL` is set, otherwise in-memory.
- Excel export: capped at 50k rows, formula-injection escaping.
- Input limits: label max 100 chars, icon max 200.
- `/auth/upload-image` now requires auth, validates magic bytes (PNG/JPEG), names files by user id, and saves `profileImageUrl` on the user. Register ignores client-supplied `profileImageUrl`.
- Frontend signup now registers first, then uploads the photo.

### Frontend-dependent changes (2026-11-20)
- **Short-lived tokens:** 15-min access token (body) + 7-day refresh token in httpOnly cookie (`SameSite=None; Secure` in production). New `POST /auth/refresh` (rotates cookie, checks user still exists) and `POST /auth/logout`. Refresh/logout reject untrusted `Origin`. Axios refreshes once on 401 and retries (`frontend/src/utils/axiosInstance.js`). Optional env `JWT_REFRESH_SECRET`.
- **Money as integer cents:** stored as `amountCents`; API still returns/accepts decimal `amount`, so the frontend is unchanged. Helpers in `utils/money.js`. **Run `node backend/scripts/migrate-amount-to-cents.js` BEFORE deploying** (idempotent; legacy `amount` left in place for rollback).
- **Export date range:** `?from=YYYY-MM-DD&to=YYYY-MM-DD` (inclusive) on both `downloadexcel` endpoints; From/To pickers in the income and expense lists.

### Cleanup
- `controllers/transactionControllerFactory.js` replaces duplicated income and expense controllers.

## 2. Pending manual steps
- [ ] `git rm backend/utils/pagination.js backend/utils/transactionValidation.js` (unused).
- [ ] `cd backend && npm i` (added `redis`, `rate-limit-redis` to package.json).
- [ ] Run `npm run lint` and smoke-test: register, login, upload, CRUD, dashboard, export.
- [ ] Check index build time on large collections before deploying the new `amount` index.
- [ ] Run the cents migration script before deploying (see above), and verify counts.
- [ ] Set `REDIS_URL` in production for shared rate limiting.
- [ ] Untrack `frontend/.env` and `frontend/lint_output*.txt` (`git rm --cached`) and confirm `.env` has no secrets.

## 3. Known gaps
- No instant token revocation: access tokens live 15 min, refresh tokens 7 days (stateless; logout only clears the cookie). Add a `tokenVersion` to revoke.
- Safari/ITP and other browsers that block third-party cookies can break refresh while the frontend (Vercel) and API (Render) are on different sites. Fix: serve both under one registrable domain or proxy `/api` through Vercel rewrites.
- Dashboard totals still computed per request (index-covered). Slows at very large per-user volumes.
- Rate-limit store is per instance unless Redis is configured.
- Access token still in localStorage (15-min XSS exposure). Route guards only check token presence.
- `/uploads` static route kept for legacy files in `backend/uploads/`.
- No automated tests.
- README is out of date: recurring income, real-time updates and Chart.js are not implemented, PATCH endpoints are missing, Node 14+ is outdated.
- Frontend naming typos: `ExpenseTransactoins.jsx`, `IncomeTransactoins.jsx`, `CustomAutBarChart.jsx`.

## 4. Roadmap (suggested order)
1. **Multi-instance deploy**: 2+ instances behind a load balancer (PM2 cluster or containers), `/ready` endpoint, paid host (no sleeping), remove keep-alive cron, CDN or reverse proxy in front.
2. **Running totals**: `UserStats {userId, totalIncome, totalExpense}` updated with `$inc` on add, update and delete (use transactions or an outbox). Optional daily or monthly rollups for charts.
3. **Redis caching**: dashboard cache per user (30-60s, invalidate on write), cached export, `tokenVersion` for revocation, `Cache-Control` on reads.
4. **Cursor pagination** on `(date, _id)` instead of skip/limit.
5. **Job queue** (BullMQ): Excel generation and image processing in workers, direct-to-ImageKit signed uploads, resize avatars.
6. **Resilience**: timeouts, retries with backoff and circuit breaker for ImageKit and Redis (limiter fails open), idempotency keys on `POST /add`, request IDs.
7. **Observability**: `pino` structured logs, Prometheus or Datadog metrics (p95, error rate, pool usage, event-loop lag), Sentry, OpenTelemetry, alerts.
8. **Security**: 15-min access tokens plus httpOnly refresh cookie, zod/joi request validation, `engines` lock, Dockerfile, CI/CD with `npm audit`.
9. **Database**: replica set with secondary reads for list and dashboard, shard on hashed `userId` only when needed, archival or TTL policy, explicit index migrations (don't rely on `autoIndex` in production), slow-query review.
10. **Quality**: supertest + mongodb-memory-server integration tests, k6/autocannon load test in CI.
11. **Housekeeping**: refactor README, fix frontend filename typos, merge the transaction util helpers.

## 5. Key files
| Area | File |
|---|---|
| Server bootstrap, shutdown, health | `backend/server.js` |
| DB pool config | `backend/config/db.js` |
| Redis store for limiters | `backend/config/redis.js` |
| Auth (JWT) | `backend/middleware/authMiddleware.js` |
| Rate limits | `backend/middleware/rateLimiter.js` |
| Shared CRUD + export | `backend/controllers/transactionControllerFactory.js` |
| Dashboard aggregation | `backend/controllers/dashboardController.js` |
| Upload | `backend/controllers/uploadController.js` |
| Models and indexes | `backend/models/*.js` |

## 6. Environment variables
`MONGO_URI`, `JWT_SECRET` (required), `CLIENT_URL`, `PORT`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `RENDER_EXTERNAL_URL` (keep-alive), `NODE_ENV`, `JWT_REFRESH_SECRET` (optional), `MONGO_MAX_POOL` (optional), `REDIS_URL` (optional).
