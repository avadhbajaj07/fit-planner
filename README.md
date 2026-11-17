# FIT Planner — Athlete OS & Training Log (PWA)

> **Your Goals. Your Body. Your Plan.**  
> A mobile-first, subscription fitness and nutrition planning web application engineered with an authentic native iOS look-and-feel (Apple Fitness / Apple Health aesthetic).

---

## 🚀 Live Core Architecture & Signature Features

1. **Live "Your Plan" Card (Signature Feature)**:
   - On mobile, sits as an interactive header peek that expands into an iOS bottom sheet.
   - On desktop, displays side-by-side as a persistent athlete log card.
   - Updates with every answer: dynamic 7-day ring cadence, session duration, exercise count, and interactive anatomical body diagram.
2. **Pure Deterministic Recommendation Engine (`/lib/engine`)**:
   - 100% deterministic, pure functions. Same inputs always yield the same plan.
   - Unit-tested with Vitest.
   - Automatic split selection (Full Body, Upper/Lower, Push/Pull/Legs) based on training days and experience.
   - Double-progression scheme (add reps, then add load).
   - "Why this plan" transparent engine rationale.
3. **Restricted Mode & Safety (GDPR / Swiss FADP Ready)**:
   - Contraindication filtering against 40+ approved exercises.
   - Explicit sensitive health data consent modal (Protocol v1.2) before saving health or injury answers.
   - Automatic substitution of high-impact movements with joint-friendly regressions.
4. **Native iOS App Feel (Mobile-First)**:
   - 49px translucent blur bottom tab bar with 5 tabs: **Today**, **Plan**, **Progress**, **Nutrition**, **Profile**.
   - Large-title navigation header (34px) with safe-area padding.
   - 100dvh viewport and `viewport-fit=cover`.
   - iOS grouped inset lists, action buttons, and segmented controls.
   - Concentric activity rings strip.
   - Focus Mode with automatic rest countdown timers, vibration haptics, and set completion logging.
   - "Adjust my week" bottom sheet: *20-min express*, *low energy deload*, *bodyweight anywhere*.

---

## 🎨 Design Tokens & System

- **Background**: `#07151D`
- **Secondary Background**: `#102831`
- **Card**: `#142D35`
- **Primary Teal**: `#28DACC`
- **Hover Teal**: `#41E9DC`
- **Text**: `#F4F9FA`
- **Secondary Text**: `#A8C5CA`
- **Borders**: `#28525B`
- **Semantic Success**: `#28DA8B`
- **Semantic Warning**: `#FFB020`
- **Semantic Error**: `#FF5C5C`
- **Typography**: `-apple-system`, `SF Pro Text`, `Inter` for UI; `JetBrains Mono` / monospace for sets, reps, kg, timers, and streaks.

---

## 📁 Project Structure

```
fit-planner/
├── src/
│   ├── app/
│   │   ├── globals.css                # Tailwind v4 theme tokens & iOS utilities
│   │   ├── layout.tsx                 # Root layout with PWA meta & viewport-fit=cover
│   │   ├── page.tsx                   # Public homepage (Hero demo, 3-steps, bento, FAQ)
│   │   ├── assessment/page.tsx        # Stage A 9-step assessment with live plan card
│   │   ├── results/page.tsx           # Results blueprint with "Why this plan"
│   │   ├── auth/
│   │   │   ├── signup/page.tsx        # Registration with local demo fallback
│   │   │   ├── login/page.tsx         # Login with demo athlete 1-click access
│   │   │   └── forgot-password/page.tsx
│   │   ├── app/
│   │   │   ├── layout.tsx             # Customer shell: desktop sidebar + mobile tab bar
│   │   │   ├── today/page.tsx         # Dashboard bento grid, activity rings, checklist
│   │   │   ├── plan/page.tsx          # 7-day calendar, session view, "Adjust my week"
│   │   │   ├── progress/page.tsx      # Recharts weight trend & workout consistency
│   │   │   ├── nutrition/page.tsx     # Stage C questionnaire & general guidance notes
│   │   │   ├── profile/page.tsx       # iOS Settings grouped lists, GDPR export/delete
│   │   │   └── workout/[id]/page.tsx  # Interactive workout session & Focus Mode
│   │   ├── privacy/page.tsx           # GDPR / Swiss FADP policy template
│   │   ├── terms/page.tsx             # Terms & conditions
│   │   └── disclaimer/page.tsx        # Medical & exercise disclaimer
│   ├── components/
│   │   ├── assessment/
│   │   │   ├── BodyDiagram.tsx        # SVG anatomy highlighting active muscle groups
│   │   │   ├── LivePlanCard.tsx       # Real-time plan card (mobile peek + desktop side)
│   │   │   └── ConsentModal.tsx       # Explicit health consent modal (v1.2)
│   │   ├── layout/
│   │   │   ├── IosTabBar.tsx          # 49px translucent bottom tab bar & desktop sidebar
│   │   │   └── IosNavBar.tsx          # Large-title iOS navigation bar
│   │   └── workout/
│   │       ├── WeeklyRingStrip.tsx    # 7 concentric activity rings
│   │       └── FocusModeModal.tsx     # One-exercise-per-screen with rest timer
│   └── lib/
│       ├── engine/
│       │   ├── types.ts               # Core domain types
│       │   ├── exercises.ts           # ~40 approved exercises with contraindication tags
│       │   ├── recommendation.ts      # Pure deterministic recommendation engine
│       │   ├── adjustments.ts         # "Adjust my week" handlers
│       │   └── __tests__/             # Vitest unit test suite
│       ├── assessment/
│       │   ├── schema.ts              # Zod validation schema
│       │   └── storage.ts             # LocalStorage autosave helpers
│       └── auth/
│           └── authContext.tsx        # Supabase/Demo mode authentication provider
├── supabase/
│   ├── migrations/
│   │   └── 20261117_initial_schema.sql # Complete PostgreSQL schema with RLS policies
│   └── seed.sql                       # Sample exercise library and platform config
├── .env.example
├── package.json
└── README.md
```

---

## 🛠 Local Development & Testing

1. **Install dependencies**:
   ```bash
   cd fit-planner
   npm install --legacy-peer-deps
   ```

2. **Run Recommendation Engine Unit Tests**:
   ```bash
   npm test
   ```
   *Runs Vitest pure engine tests verifying determinism, split selection, duration calculation, and restriction filtering.*

3. **Run Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser (or iOS Simulator / mobile Chrome).

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🚢 Deployment Instructions

### Vercel
1. Push repository to GitHub or GitLab.
2. Import repository into Vercel.
3. Add environment variables from `.env.example` in Vercel Project Settings:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SUPABASE_URL` (optional for local demo)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional for local demo)
4. Deploy! Next.js 16 App Router builds and serves Edge/Node routes natively.

### Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Go to SQL Editor and run `supabase/migrations/20261117_initial_schema.sql`.
3. Run `supabase/seed.sql` to populate sample exercises.
4. Copy Project URL and Anon Key into your `.env.local`.

---

## 📋 Phase 1 Status Report

- [x] **Complete**:
  - Full project structure, dark "Training Log" design system & CSS tokens
  - Native iOS-style app shell (49px bottom tab bar, safe areas, large titles)
  - Public Homepage with live demo card, 3-step workflow, bento grid, pricing teaser, FAQ
  - Stage A Assessment (9 questions, age 18+ enforcement, Live Plan Card updating in real time)
  - Interactive SVG Body Diagram highlighting target muscles
  - Explicit Sensitive Health Data Consent modal (Protocol v1.2)
  - Results Preview with "Why this plan" transparent engine rationale
  - Pure deterministic Recommendation Engine in `/lib/engine`
  - Exercise Library with ~40 approved exercises with contraindication tags
  - 100% passing unit tests via Vitest
  - Customer App (Today, Plan, Progress, Nutrition, Profile tabs)
  - Focus Mode with automated countdown rest timer, haptics, and set completion
  - 7-Day Concentric Activity Rings strip
  - "Adjust my week" tools (20-min express, low energy, bodyweight only)
  - Self-service data export (GDPR Art. 20) & account deletion (Art. 17)
  - PostgreSQL migrations with Row-Level Security (RLS) & seed script
  - `.env.example` template
- ⚠️ **Needs Configuration**:
  - Supabase URL & Anon Key: If omitted, runs in clearly labelled Local Demo Mode
  - Stripe / Razorpay: Shows clear "Payment Setup Required" state (never simulates fake success)
  - Resend / SMTP: Email recovery shows dev note until credentials provided
- 🧪 **Untested**:
  - Physical native Capacitor wrapper (web PWA tested)
