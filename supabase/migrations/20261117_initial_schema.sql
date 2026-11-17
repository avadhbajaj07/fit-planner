-- FIT Planner: PostgreSQL Schema with Row-Level Security (RLS)
-- Phase 1 Migration

-- 1. Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'coach', 'support', 'admin')),
  is_demo_account BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Sensitive Health Consent Records (GDPR / Swiss FADP)
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  protocol_version TEXT NOT NULL DEFAULT '1.2',
  medical_disclaimer_accepted BOOLEAN NOT NULL,
  sensitive_health_data_accepted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- 3. Assessments & Questionnaires
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '1.0',
  stage TEXT NOT NULL CHECK (stage IN ('stage_a', 'stage_b', 'stage_c', 'complete')),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Exercises Library
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  primary_muscles TEXT[] NOT NULL,
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment_needed TEXT[] NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT[] NOT NULL,
  common_mistakes TEXT[] DEFAULT '{}',
  safety_notes TEXT,
  contraindications TEXT[] DEFAULT '{}',
  is_low_impact BOOLEAN NOT NULL DEFAULT FALSE,
  alternative_exercise_ids TEXT[] DEFAULT '{}',
  default_sets INT NOT NULL DEFAULT 3,
  default_reps TEXT NOT NULL DEFAULT '10-12',
  default_rest_seconds INT NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Generated Workout Plans & Schedules
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  fitness_level TEXT NOT NULL,
  split TEXT NOT NULL,
  days_per_week INT NOT NULL,
  duration_minutes INT NOT NULL,
  is_restricted_mode BOOLEAN NOT NULL DEFAULT FALSE,
  safety_notice TEXT,
  rationale_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  day_name TEXT NOT NULL,
  title TEXT NOT NULL,
  is_rest_day BOOLEAN NOT NULL DEFAULT FALSE,
  focus_muscles TEXT[] DEFAULT '{}',
  exercises_json JSONB NOT NULL
);

-- 6. Workout Logs & Exercise Set Logs
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
  session_title TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS public.exercise_set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES public.exercises(id),
  set_number INT NOT NULL,
  target_reps TEXT NOT NULL,
  completed_reps INT NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Progress & Weigh-in Entries
CREATE TABLE IF NOT EXISTS public.progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Subscriptions & Billing Status
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'razorpay', 'manual')),
  provider_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'unconfigured')),
  tier_months INT NOT NULL CHECK (tier_months IN (1, 3, 6)),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Site Settings & Config
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Customers can only read and edit their own rows
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users view own consent records" ON public.consent_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own consent records" ON public.consent_records FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own plans" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own plans" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own workout logs" ON public.workout_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own workout logs" ON public.workout_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own progress" ON public.progress_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON public.progress_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Exercises are publicly readable for all authenticated or anon users
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are viewable by all" ON public.exercises FOR SELECT USING (true);
