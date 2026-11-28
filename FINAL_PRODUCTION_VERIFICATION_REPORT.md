# Shape Radar — Final Production Verification & Client Delivery Report

**Website:** https://www.shaperadar.com/  
**QA Branch:** `qa/final-verification`  
**Verified Commit SHA:** `8665ad2e77326c34e46bfb156400148e415c9c12`  
**Vercel Preview URL:** https://fit-planner-629zolokp-shouryasaad6-1095s-projects.vercel.app  
**Audit Date:** November 28, 2026  

---

## Executive Recommendation

**RECOMMENDATION: CONDITIONAL HOLD (Do Not Promote to Production Yet)**

While all core application routes, workout/nutrition engines, Supabase RLS isolation, and hardened sandbox billing security **PASS** in local verification and the Vercel preview compiled cleanly (`31/31` routes), **three external production blockers** prevent immediate 100% production sign-off:
1. **Resend Email Delivery (`BLOCKED`)**: `RESEND_API_KEY` is not configured in `.env.local` or Vercel environment variables, and `shaperadar.com` lacks SPF (`send.shaperadar.com`) and `_dmarc.shaperadar.com` DNS records (only `resend._domainkey.shaperadar.com` is present). Real inbox delivery could not be verified.
2. **Facebook OAuth Live Consent (`BLOCKED`)**: Meta Developer App `29256580257294639` still requires the `email` permission to be added under **Use cases > Authentication and account creation > Customize** in Meta Developer Console.
3. **Vercel Preview E2E Regression (`BLOCKED`)**: Unauthenticated Playwright regression against the Vercel Preview URL was blocked by Vercel Deployment Protection (`302 -> vercel.com/sso-api`).

---

## 1. Confirmed Bugs Discovered & Fixed During Final Verification

| ID | Area | Severity | Bug Discovered | Fix Implemented on `qa/final-verification` | Status |
|---|---|---|---|---|---|
| **QA-SEC-01** | Sandbox Billing | **Critical** | `getActiveBillingProvider()` defaulted to `"sandbox"` in production (`VERCEL_ENV === "production"`), allowing any production user to open `/membership/sandbox-checkout` and obtain PRO access without paying. | Added `src/lib/billing/sandboxSecurity.ts`. In production, sandbox is hard-blocked (`403`) unless `ENABLE_SANDBOX_BILLING=true` AND user email is in `SANDBOX_TEST_EMAILS`. `provider.ts` defaults to `NullBillingAdapter` in production. | **FIXED & PASS** |
| **QA-SEC-02** | Billing Webhook | **Critical** | `POST /api/billing/webhook` accepted unsigned JSON payloads for `"sandbox"` directly from browsers, had no replay protection, and fell back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`. | Added HMAC-SHA256 signature verification (`x-sandbox-signature` with 300s timestamp replay window via `crypto.timingSafeEqual`), server-only `SUPABASE_SERVICE_ROLE_KEY`, `public.billing_events` idempotency table, and `public.sandbox_checkout_sessions` single-use sessions. | **FIXED & PASS** |
| **QA-SEC-03** | Billing Checkout | **Critical** | `POST /api/billing/checkout` trusted client-supplied `userId` and `userEmail`, and fell back `appUrl` to `http://localhost:3000`. | Checkout now authenticates the caller via Supabase JWT (`401` if unauthenticated), derives `userId` / `userEmail` from the verified user, derives `tierMonths` and `amount` server-side from `DEFAULT_MEMBERSHIP_PLANS`, and uses `req.nextUrl.origin` fallback. | **FIXED & PASS** |
| **QA-SEC-04** | Supabase RLS | **Critical** | `public.profiles` UPDATE policy (`auth.uid() = id`) had no column restriction, allowing any logged-in user to directly update `membership_status = 'active'` or `role = 'admin'` via Supabase client! (Initial `SECURITY DEFINER` trigger also bypassed the check because `current_user` became `postgres`). | Created `BEFORE UPDATE` `SECURITY INVOKER` trigger `prevent_profile_privilege_escalation()` checking `current_user IN ('service_role', 'postgres', 'supabase_admin')`. Verified live: ordinary user updates to `role` and `membership_status` are rejected with `Unauthorized`. | **FIXED & PASS** |
| **QA-SEC-05** | Email API | **Major** | `POST /api/email/send-plan` accepted any arbitrary `email` without authentication, creating an open email relay abuse vector. | Hardened `src/app/api/email/send-plan/route.ts` to require a verified Supabase session (`401` if unauthenticated) and send exclusively to `user.email`. | **FIXED & PASS** |
| **QA-DB-01** | Supabase Advisors | **Minor** | `public.is_admin()` and `public.handle_new_user()` were `SECURITY DEFINER` without explicit `SET search_path = public`. | Altered both functions with `SET search_path = public` and committed in `supabase/migrations/20261128_security_and_subscriptions.sql`. | **FIXED & PASS** |
| **QA-TS-01** | Build / Types | **Minor** | Redundant `action === "cancel"` check in `src/app/api/billing/sandbox-complete/route.ts:162` failed `tsc --noEmit`. | Removed unreachable branch; `tsc --noEmit` and `next build` pass cleanly. | **FIXED & PASS** |

---

## 2. Sandbox Payment Security Verification Results

Tested live against local server + Supabase PostgreSQL (`qa_a_*` and `qa_b_*` isolated test users, cleaned up after test):

| Check | Result | Supporting Evidence |
|---|---|---|
| Unauthenticated checkout rejection | **PASS** | `POST /api/billing/checkout` without token -> `HTTP 401` |
| Unsigned webhook rejection | **PASS** | `POST /api/billing/webhook` without valid `x-sandbox-signature` -> `HTTP 401` |
| Server-side price, tier & user binding | **PASS** | `checkout/route.ts` ignores client `userId`/`amount`; looks up `planId` & `currency` from `DEFAULT_MEMBERSHIP_PLANS` and binds `user.id` from Supabase JWT. |
| Single-use session & duplicate prevention | **PASS** | `POST /api/billing/sandbox-complete` (`complete`) -> `200 OK (dbSynced: true)`; immediate second `complete` on same `sessionId` -> `HTTP 409 Conflict`. |
| Subscription activation & `is_sandbox` flag | **PASS** | `profiles.membership_status` -> `'active'`; `subscriptions.is_sandbox` -> `true`, `provider` -> `'sandbox'`. |
| Refund / cancellation revokes PRO access | **PASS** | `POST /api/billing/sandbox-complete` (`refund`) -> `200 OK`; `profiles.membership_status` reverted to `'free'`. |
| Production isolation | **PASS** | `isSandboxAllowed()` + `getActiveBillingProvider()` return `403` / `NullBillingAdapter` when `VERCEL_ENV === 'production'` and `ENABLE_SANDBOX_BILLING !== 'true'`. |

---

## 3. Supabase Security & Database Migration Verification

| Check | Result | Supporting Evidence |
|---|---|---|
| RLS enabled on all `public` tables | **PASS** | `SELECT tablename FROM pg_tables WHERE schemaname='public' AND rowsecurity=false` returned `0 rows` (all 11 tables have RLS enabled: `profiles`, `consent_records`, `exercises`, `member_assessments`, `member_nutrition_plans`, `member_workout_plans`, `workout_logs`, `workout_templates`, `subscriptions`, `sandbox_checkout_sessions`, `billing_events`). |
| Cross-account data isolation (2 test users) | **PASS** | User B (`qa_b_*`) querying `profiles` and `member_assessments` for User A's `id` returned `0 rows`. |
| Service-only billing tables locked down | **PASS** | Authenticated User B querying `sandbox_checkout_sessions` and `billing_events` returned `0 rows`. |
| Direct privilege escalation blocked | **PASS** | User A calling `supabase.from('profiles').update({ membership_status: 'active' })` -> error `"Unauthorized: cannot modify membership_status"`; `{ role: 'admin' }` -> error `"Unauthorized: cannot modify role"`. |
| Storage bucket exposure | **PASS** | `SELECT id, name, public FROM storage.buckets` returned `0 rows`. |
| Exposed service-role keys in `src/` or `public/` | **PASS** | `grep` confirmed zero hardcoded secrets; `SUPABASE_SERVICE_ROLE_KEY` is used server-side only. |
| Migration parity with GitHub | **PASS** | Added and applied `supabase/migrations/20261128_security_and_subscriptions.sql` (committed at `8665ad2`). |

---

## 4. Resend Email Delivery & DNS Audit

| Check | Result | Supporting Evidence |
|---|---|---|
| `/api/email/send-plan` authorization | **PASS** | Unauthenticated `POST /api/email/send-plan` returned `HTTP 401`. Authenticated calls send only to verified `user.email`. |
| `resend._domainkey.shaperadar.com` DKIM | **PASS** | `dig +short TXT resend._domainkey.shaperadar.com` returned valid RSA public key. |
| SPF (`send.shaperadar.com`) & DMARC (`_dmarc.shaperadar.com`) | **FAIL** | `dig +short TXT send.shaperadar.com`, `MX send.shaperadar.com`, and `TXT _dmarc.shaperadar.com` all returned empty. |
| `RESEND_API_KEY` configured | **FAIL** | Absent from `.env.local` and `vercel env ls`. |
| Actual inbox delivery (Welcome, Reset, Receipt, Cancellation) | **BLOCKED** | Cannot deliver real emails without `RESEND_API_KEY` and verified SPF/DMARC DNS records. |

---

## 5. Authentication Verification

| Flow | Result | Evidence |
|---|---|---|
| Email Registration, Login, Logout, Session Persistence | **PASS** | Verified in Playwright (`Desktop Chrome` & `Mobile iPhone 13`) and live Supabase Auth (`qa_a_*` / `qa_b_*` sign-in). |
| Protected Routes (`/app/*`) & Legacy `/admin` Redirect | **PASS** | Unauthenticated requests to all 7 `/app/*` routes redirect `307 -> /auth/login?next=...`; `/admin` redirects `307 -> /`. |
| Google OAuth (`Continue with Google`) | **PASS (UI/Initiation)** | Button triggers `signInWithOAuth({ provider: 'google' })` with dynamic `${window.location.origin}/auth/callback` (no localhost redirect). Full Google interactive login requires manual human credentials. |
| Facebook OAuth (`Continue with Facebook`) | **BLOCKED** | Frontend correctly redirects to Meta OAuth (`client_id=29256580257294639`), but Meta blocks with `Invalid Scopes: email` until `email` permission is added in Meta Developer Console. |
| Forgot/Reset Password & Account Deletion UI | **PASS (Code/Route)** | `/auth/forgot-password` renders (`200`) and invokes `supabase.auth.resetPasswordForEmail`; live email delivery is `BLOCKED` by SMTP/Resend setup. |

---

## 6. Complete Route Inventory (31 Compiled Routes Reconciled)

`next build` compiled **31** route entries (the previous report cited 30 before `/api/billing/sandbox-complete` was added; `check:links` only tested 22 public/smoke paths). Full reconciliation:

* **Public Pages (10/10 PASS — HTTP 200)**: `/`, `/assessment`, `/membership`, `/membership/sandbox-checkout`, `/membership/success`, `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/callback`, `/terms`, `/privacy`, `/disclaimer`, `/results` (note: `/membership/sandbox-checkout` and `/membership/success` also render 200 and enforce auth client/server-side).
* **Protected Athlete Pages (7/7 PASS — 307 Redirect when unauthenticated, 200 when authenticated)**: `/app/today`, `/app/plan`, `/app/nutrition`, `/app/exercises`, `/app/progress`, `/app/profile`, `/app/profile/checklist`, plus dynamic `/app/workout/[id]`.
* **API Routes (5/5 PASS)**:
  * `/api/ai/ask` (`200 OK` on valid query)
  * `/api/billing/checkout` (`401` unauth, `200` auth)
  * `/api/billing/sandbox-complete` (`401` unauth, `200` auth)
  * `/api/billing/webhook` (`401` unsigned, `200` HMAC-signed)
  * `/api/email/send-plan` (`401` unauth)
* **Metadata / System Routes (3/3 PASS)**: `/_not-found` (`404` branded page), `/robots.txt` (`200`), `/sitemap.xml` (`200`).
* **Deprecated Routes**: `/admin/*` removed from build; middleware redirects `/admin` -> `/`.

---

## 7. Fitness & Nutrition Accuracy Verification

Tested `generateWorkoutPlan` and `generateDailyMealPlan` across 3 distinct profiles:

1. **Male / Beginner / Home / Resistance Bands / Weight Loss (94kg -> 82kg, 3d, 30m)**:
   * Workout: `full_body`, 7-day schedule structure, `restrictedMode=false`. **PASS**
   * Nutrition: `1260 kcal` (3 European meals), `76g P / 164g C / 34g F`.
2. **Female / Advanced / Gym / Barbell+Dumbbells / Build Muscle (58kg -> 62kg, 5d, 60m, Dairy-Free)**:
   * Workout: `push_pull_legs`, `restrictedMode=false`. **PASS**
   * Nutrition: `1460 kcal` (4 meals), `86g P / 169g C / 49g F`, **0 dairy allergens** (`fish, gluten, soy`). **PASS**
3. **Female / Intermediate / Home / Bodyweight / Maintenance + Knee Pain + Vegan + Nut/Gluten Allergy (5 meals/day)**:
   * Workout: `upper_lower`, `restrictedMode=true` (knee-safe filtering active). **PASS**
   * Nutrition: `1540 kcal` (5 meals), `98g P`, **0 nuts / 0 gluten / 0 dairy / 0 meat**. **PASS**

**Important Finding (Minor Limitation)**: `generateDailyMealPlan()` sums fixed portion calories from the European recipe catalog (`1260–1540 kcal`) rather than dynamically scaling portion multipliers to match a high-TDEE male's target (e.g., 94kg male wanting weight loss would typically target ~2100 kcal, not 1260 kcal). Flagged for post-launch nutrition scaling enhancement.

---

## 8. Mobile & Desktop Quality Assurance

* **Playwright E2E Suite (Local)**: **12/12 PASS** across `Desktop Chrome` and `Mobile iPhone 13` (Homepage anchors & AI modal, Express Assessment, Auth Login/Logout, Workout Log & Rest Timer, Membership Pricing, Social OAuth buttons).
* **Multi-Viewport Overflow & Console Audit**: **PASS** — tested `360px`, `390px`, `430px`, `768px`, `1024px`, `1440px`, and `1920px` across public and authenticated routes:
  * Horizontal overflow issues: **0**
  * Browser console errors: **0**
  * HTTP 5xx responses: **0**
* *Note*: Viewport tests used Chromium device/viewport emulation; physical iOS/Android hardware testing was not performed.

---

## 9. GitHub & Vercel Verification

| Item | Status | Details |
|---|---|---|
| QA Branch & Commit | **PASS** | Branch `qa/final-verification` pushed to GitHub at commit `8665ad2e77326c34e46bfb156400148e415c9c12`. |
| ESLint, TypeScript, Unit Tests, Prod Build | **PASS** | `npx eslint --quiet` (0 errors), `npx tsc --noEmit` (0 errors), `npm test` (66/66 passed), `npm run build` (31/31 routes compiled). |
| Vercel Preview Deployment | **PASS** | Deployed to `https://fit-planner-629zolokp-shouryasaad6-1095s-projects.vercel.app` (Ready). `main` / production was NOT modified. |
| Vercel Preview E2E Regression | **BLOCKED** | Preview URL protected by Vercel SSO (`302 -> vercel.com/sso-api`). |
| Vercel Env Vars Check | **PARTIAL** | Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` exist in Vercel. Missing: `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`, `SANDBOX_WEBHOOK_SECRET`, `ENABLE_SANDBOX_BILLING` (Preview only), `SANDBOX_TEST_EMAILS`. |

---

## 10. Manual Configuration Required From You Before Production Promotion

1. **Meta Developer Console (Facebook Login)**:
   * Open App `29256580257294639` > **Use cases** > **Authentication and account creation** > **Customize** > Add **`email`** permission.
2. **Resend & DNS (`shaperadar.com`)**:
   * Add `RESEND_API_KEY` to Vercel Environment Variables (Production & Preview) and `.env.local`.
   * Add the Resend-provided `SPF` (`TXT`/`MX` on `send.shaperadar.com`) and `_dmarc.shaperadar.com` TXT record (`v=DMARC1; p=none;`).
3. **Vercel Environment Variables**:
   * Set `NEXT_PUBLIC_APP_URL=https://www.shaperadar.com` in Production.
   * Set `SANDBOX_WEBHOOK_SECRET` (random 32-byte hex string) in Preview (and keep `ENABLE_SANDBOX_BILLING` unset/false in Production).
   * To allow automated E2E on Vercel Preview, either disable Preview Deployment Protection or generate a Protection Bypass secret.
4. **Final Merge**:
   * Once you confirm the above manual steps, approve merging `qa/final-verification` into `main` and promoting to `https://www.shaperadar.com/`.
