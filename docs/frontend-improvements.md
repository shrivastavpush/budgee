# Budgee Frontend: Changes & Roadmap

Last updated: 2026-11-20. Scope: `frontend/` (React 19, Vite 8, Tailwind 4, React Router 7, Recharts 3, axios).
Status: changes below are written but **not yet linted or run in a browser** (dependencies not installed locally).

## 1. Done so far

### Auth and session (pairs with the backend short-lived tokens)
- `utils/axiosInstance.js`: `withCredentials: true` so the httpOnly refresh cookie is sent. On a 401 it calls `POST /auth/refresh` once (one shared in-flight promise for concurrent requests), stores the new access token, and retries the original request. Logs out only if the refresh fails. Auth endpoints (login, register, refresh, logout) are excluded from the retry.
- `utils/apiPaths.js`: added `AUTH.REFRESH` and `AUTH.LOGOUT`.
- `components/layouts/Navbar.jsx`: logout now also calls `POST /auth/logout` (fire-and-forget) to clear the cookie.
- Signup (`pages/Auth/SignUp.jsx`): registers first, then uploads the profile photo with the new token (the upload endpoint now requires auth). A failed upload shows a toast but does not block signup. `utils/uploadImage.js` no longer sends a username.

### Export date range
- New `components/common/ExportRange.jsx` (From/To date inputs, both optional, inclusive).
- `IncomeList.jsx` and `ExpenseList.jsx` keep the range in local state and pass it to `onDownload`.
- `hooks/useIncome.js`, `hooks/useExpense.js` and `utils/downloadUtils.js` send `from` and `to` as query params (omitted when empty).

### INR display
- `utils/helper.js`: `formatINR` (`Intl` en-IN, ₹, always 2 decimals, lakh/crore grouping) replaces `addThousandSeparator`. `formatINRCompact` gives axis labels (₹1.5K, ₹2.3L, ₹1.2Cr).
- Applied to dashboard cards (`pages/Dashboard/Home.jsx`, `InfoCard.jsx`), `TransactionInfoCard.jsx`, `CustomTooltip.jsx`, and the tooltips and Y-axes of `CustomLineChart.jsx` and `CustomBarChart.jsx`.
- `components/common/Input.jsx` now passes `step` and `min` through. Amount inputs use `step="0.01"`, `min="0.01"`, and labels read "Income Amount (₹)" and "Expense Amount (₹)".
- Visual change: whole-rupee amounts now show as ₹1,000.00 instead of ₹1,000.

## 2. Pending manual steps
- [ ] `cd frontend && npm i && npm run lint`, then fix anything reported.
- [ ] Browser smoke test: signup with and without a photo, login, let the access token expire (or delete it from localStorage) and confirm a request refreshes silently, logout, export with and without a date range, check INR formatting on cards, tooltips and chart axes.
- [ ] Verify the exported Excel file shows ₹ with lakh/crore grouping.
- [ ] Untrack `frontend/.env` and `frontend/lint_output*.txt` (`git rm --cached`) and confirm `.env` holds no secrets.
- [ ] Deploy frontend and backend together (an old frontend cannot refresh tokens, so users would be logged out after 15 minutes).

## 3. Known gaps
- **Third-party cookies:** Vercel (frontend) and Render (API) are different sites. Safari and other browsers that block third-party cookies can fail the refresh and log users out every 15 minutes. Fix: serve both under one registrable domain, or proxy `/api` through Vercel rewrites in `vercel.json`.
- Access token is still stored in `localStorage` (15-minute XSS exposure window).
- Route guards (`App.jsx`) check only that a token exists, not that it is valid. An expired token is handled lazily by the first API call.
- Download button is disabled when the current page has no rows, so a date range with no matches on the page being viewed cannot be exported.
- `axiosInstance` timeout is 10s, which is shorter than a Render cold start. Users may see "Request timeout" on the first request after the server sleeps.
- `CustomAutBarChart.jsx` has no ₹ formatting on its Y-axis. It is unclear whether it is still used.
- No automated tests (unit or component).
- Typos in file names: `ExpenseTransactoins.jsx`, `IncomeTransactoins.jsx`, `CustomAutBarChart.jsx`.
- Client-side amount validation does not limit decimals. The backend rounds to 2 decimals.
- Accessibility has not been audited (focus management in modals, chart alternatives, colour contrast across themes).

## 4. Roadmap (suggested order)
1. **Cookie-safe deployment:** same-domain or Vercel `/api` rewrite so refresh works in Safari. Then consider keeping the access token in memory only (no localStorage), with the first load calling `/auth/refresh`.
2. **Cursor pagination:** replace page numbers with a `(date, _id)` cursor and "Load more" or infinite scroll in `useIncome` and `useExpense` (pairs with backend roadmap item 4).
3. **Loading and error UX:** longer timeout or a "waking the server" message for cold starts, retry buttons, skeletons for lists and charts, an error boundary per route.
4. **Performance:** keep the existing lazy routes and Recharts chunk split. Add list virtualisation for long lists, memoise chart data, and check the bundle with `vite build --report`.
5. **Server-state library:** TanStack Query for caching, request dedupe and refetch-on-focus, replacing the hand-written data hooks and manual refetches.
6. **Form validation:** a shared validation helper (amount ≤ 2 decimals, max lengths matching the backend: label 100, icon 200, name 100, password 8-72).
7. **Currency settings:** `formatINR` is the single formatting point. If multi-currency is added, read `currency` from API responses (already returned by the backend) and pass it through `Intl.NumberFormat`.
8. **Tests:** Vitest and Testing Library for helpers (`formatINR`, `formatINRCompact`), the axios refresh interceptor, and the list and form components. Add Playwright for the auth and CRUD flow.
9. **Accessibility pass:** modal focus trap, labelled inputs, keyboard support for the emoji picker and profile menu, `aria-live` for toasts, chart data table fallback.
10. **Housekeeping:** rename the misspelled files, remove unused components, update the README (Chart.js is not used, features listed that do not exist).

## 5. Key files
| Area | File |
|---|---|
| HTTP client, token refresh | `frontend/src/utils/axiosInstance.js` |
| API route constants | `frontend/src/utils/apiPaths.js` |
| INR formatting | `frontend/src/utils/helper.js` |
| Excel download | `frontend/src/utils/downloadUtils.js` |
| Export date range UI | `frontend/src/components/common/ExportRange.jsx` |
| Data hooks | `frontend/src/hooks/useIncome.js`, `useExpense.js`, `useDashboard.js`, `useUserAuth.jsx` |
| Route guards | `frontend/src/App.jsx` |
| Auth pages | `frontend/src/pages/Auth/Login.jsx`, `SignUp.jsx` |
| Charts | `frontend/src/components/Charts/*` |

## 6. Environment variables
`VITE_BACKEND_URL` (API base URL; the only one used).

See also: [backend-changes-and-roadmap.md](backend-changes-and-roadmap.md).
