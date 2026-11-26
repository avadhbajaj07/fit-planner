# Shape Radar — Go-Live Production Deployment Checklist

**Target URL:** `https://fit-planner-drab.vercel.app` (or custom domain `https://shaperadar.app`)  
**Deployment Platform:** Vercel  
**Database & Auth:** Supabase  
**Billing Gateway:** Stripe  
**Prepared By:** Senior Full-Stack Engineer & QA Lead  
**Date:** November 26, 2026  

---

## 1. Environment Variables Configuration

Ensure all variables are populated in **Vercel Project Settings → Environment Variables** for both **Production** and **Preview** environments.

| Variable Name | Environment | Value Description | Secret? |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Production | `https://fit-planner-drab.vercel.app` (or your custom domain) | No |
| `NEXT_PUBLIC_APP_NAME` | Production | `Shape Radar` | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Live Supabase project URL (e.g. `https://tnhmsfnpwhgoisenhatp.supabase.co`) | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anonymous public key | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Supabase service-role secret key (for webhook persistence) | **YES** |
| `NEXT_PUBLIC_PAYMENT_PROVIDER` | Production | `stripe` | No |
| `STRIPE_SECRET_KEY` | Production | `sk_live_...` (Stripe live secret key) | **YES** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production | `pk_live_...` (Stripe live publishable key) | No |
| `STRIPE_WEBHOOK_SECRET` | Production | `whsec_...` (Stripe live webhook signing secret) | **YES** |
| `RESEND_API_KEY` | Production | `re_...` (Resend production API key for emails) | **YES** |
| `EMAIL_FROM` | Production | `Shape Radar <support@shaperadar.app>` | No |

---

## 2. Stripe Live-Mode Activation

1. **Switch Stripe Dashboard to Live Mode**:
   - Toggle the switch from **Test mode** to **Live mode** in the Stripe Dashboard.
   - Complete business profile verification (bank account, tax ID, business address).
2. **Create Live Products & Pricing**:
   - Create the 3 plans matching `src/lib/billing/plans.ts`:
     - **1-Month Plan**: $32.00 / month recurring.
     - **3-Month Plan**: $79.00 billed every 3 months recurring ($26.33/mo).
     - **6-Month Plan**: $129.00 billed every 6 months recurring ($21.50/mo).
3. **Register Live Webhook Endpoint**:
   - Navigate to **Developers → Webhooks → Add Endpoint**.
   - **Endpoint URL:** `https://<YOUR-DOMAIN>/api/billing/webhook`
   - **Events to listen for:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy the generated **Signing secret** (`whsec_...`) into Vercel's `STRIPE_WEBHOOK_SECRET`.
4. **Customer Portal Configuration**:
   - Enable the Stripe Customer Portal under **Settings → Billing → Customer portal**.
   - Enable "Allow customers to cancel subscriptions" and "Allow customers to switch plans".

---

## 3. Supabase Production Settings

1. **Authentication Redirect URLs**:
   - Navigate to **Authentication → URL Configuration** in Supabase Dashboard.
   - **Site URL:** Set to `https://fit-planner-drab.vercel.app` (or custom domain).
   - **Redirect URLs:** Add:
     - `https://<YOUR-DOMAIN>/**`
     - `https://<YOUR-DOMAIN>/auth/login`
     - `https://<YOUR-DOMAIN>/membership`
     - `https://<YOUR-DOMAIN>/app/today`
2. **Custom SMTP / Email Delivery (Resend)**:
   - Navigate to **Project Settings → Authentication → SMTP Settings**.
   - Enable Custom SMTP using Resend:
     - **Host:** `smtp.resend.com`
     - **Port:** `465` (SSL)
     - **User:** `resend`
     - **Password:** Your `RESEND_API_KEY`
     - **Sender Email:** `support@shaperadar.app`
3. **Database RLS Policies**:
   - Confirm Row Level Security is enabled on:
     - `public.profiles` (Users can view/edit only their own profile)
     - `public.subscriptions` (Read-only for user; write restricted to service-role)
     - `public.workout_logs` (Users read/write only their own logs)

---

## 4. Custom Domain & DNS Setup

1. **Add Custom Domain in Vercel**:
   - In Vercel Project Settings → **Domains**, add `shaperadar.app` and `www.shaperadar.app`.
2. **Configure DNS Records with Registrar**:
   - **Apex (`@` or `shaperadar.app`):**
     - Type: `A`
     - Value: `76.76.21.21`
   - **Subdomain (`www`):**
     - Type: `CNAME`
     - Value: `cname.vercel-dns.com`
3. **SSL Certificate**:
   - Vercel automatically provisions and renews Let's Encrypt SSL certificates once DNS propagates.

---

## 5. Analytics & Monitoring

1. **Vercel Web Analytics & Speed Insights**:
   - Enable Web Analytics in the Vercel Dashboard for real-time visitor stats and Core Web Vitals monitoring without cookies.
2. **Error Monitoring (Sentry)**:
   - For real-time exception tracking, install `@sentry/nextjs` and set `SENTRY_DSN` in Vercel.
   - Error boundary in `src/app/error.tsx` captures unhandled exceptions with safe fallback.

---

## 6. Rollback Plan

In the event of an unexpected regression or billing issue during rollout:
1. **Instant Vercel Rollback**:
   - Navigate to **Vercel Dashboard → Deployments**.
   - Locate the previous stable production deployment.
   - Click the three dots `...` → **Instant Rollback**. Traffic shifts immediately in under 1 second.
2. **Database Rollback**:
   - Supabase provides point-in-time recovery (PITR) and daily automated backups under **Database → Backups**.
3. **Stripe Emergency Pause**:
   - If webhook sync fails, Stripe automatically retries failed events for up to 72 hours with exponential backoff.
