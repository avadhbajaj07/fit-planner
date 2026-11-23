-- FIT Planner / Shape Radar: Master Exercise Library & Workout Engine Migration
-- RepDB Integration & Approved Templates Architecture

-- 1. Extend exercises table with RepDB schema fields
ALTER TABLE IF EXISTS public.exercises
  ADD COLUMN IF NOT EXISTS start_image TEXT,
  ADD COLUMN IF NOT EXISTS peak_image TEXT,
  ADD COLUMN IF NOT EXISTS main_image TEXT,
  ADD COLUMN IF NOT EXISTS raw_equipment TEXT,
  ADD COLUMN IF NOT EXISTS raw_primary_muscles TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS raw_secondary_muscles TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS mechanic TEXT,
  ADD COLUMN IF NOT EXISTS force_type TEXT,
  ADD COLUMN IF NOT EXISTS body_part TEXT,
  ADD COLUMN IF NOT EXISTS tips TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS goals TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_bodyweight BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_unilateral BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (review_status IN ('approved', 'pending_review', 'rejected')),
  ADD COLUMN IF NOT EXISTS source_provider TEXT DEFAULT 'RepDB',
  ADD COLUMN IF NOT EXISTS source_version TEXT DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS attribution TEXT DEFAULT 'Exercise data by RepDB (repdb.co)';

-- 2. Approved Workout Templates Table
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  goals TEXT[] NOT NULL,
  fitness_levels TEXT[] NOT NULL,
  required_equipment TEXT[] NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('home', 'gym', 'both', 'any')),
  days_per_week INT[] NOT NULL,
  split TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  safe_for_restrictions TEXT[] NOT NULL DEFAULT '{}',
  warmup_routine TEXT[] NOT NULL DEFAULT '{}',
  recovery_rules TEXT[] NOT NULL DEFAULT '{}',
  review_status TEXT NOT NULL DEFAULT 'approved' CHECK (review_status IN ('approved', 'pending_review', 'rejected')),
  reviewer TEXT,
  approved_at TIMESTAMPTZ,
  sessions_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Member Personalized Workout Plans Table
CREATE TABLE IF NOT EXISTS public.member_workout_plans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id TEXT REFERENCES public.workout_templates(id),
  goal TEXT NOT NULL,
  fitness_level TEXT NOT NULL,
  split TEXT NOT NULL,
  days_per_week INT NOT NULL,
  duration_minutes INT NOT NULL,
  is_restricted_mode BOOLEAN NOT NULL DEFAULT FALSE,
  safety_notice TEXT,
  rationale TEXT[] DEFAULT '{}',
  weekly_sessions_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Member Workout Logs & Progression History
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT,
  session_id TEXT NOT NULL,
  session_title TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  exercise_logs_json JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Row-Level Security (RLS) Policies
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Templates: readable by all authenticated users and anonymous guests
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON public.workout_templates;
CREATE POLICY "Templates are viewable by everyone"
  ON public.workout_templates FOR SELECT
  USING (review_status = 'approved' OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Member Plans: isolated to own profile
DROP POLICY IF EXISTS "Members can view own workout plans" ON public.member_workout_plans;
CREATE POLICY "Members can view own workout plans"
  ON public.member_workout_plans FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Members can insert/update own workout plans" ON public.member_workout_plans;
CREATE POLICY "Members can insert/update own workout plans"
  ON public.member_workout_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Workout Logs: isolated to own profile
DROP POLICY IF EXISTS "Members can view own workout logs" ON public.workout_logs;
CREATE POLICY "Members can view own workout logs"
  ON public.workout_logs FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Members can insert own workout logs" ON public.workout_logs;
CREATE POLICY "Members can insert own workout logs"
  ON public.workout_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Insert Canonical Approved Templates (Idempotent)
INSERT INTO public.workout_templates (
  id, title, description, goals, fitness_levels, required_equipment, location,
  days_per_week, split, duration_minutes, safe_for_restrictions, warmup_routine,
  recovery_rules, review_status, reviewer, approved_at, sessions_json
) VALUES
(
  'template_beginner_home_bodyweight',
  'Beginner Home Calisthenics & Mobility',
  'Foundational full-body routine requiring zero equipment. Focuses on movement quality, joint stability, and progressive bodyweight mastery.',
  ARRAY['improve_fitness', 'lose_weight', 'maintain'],
  ARRAY['complete_beginner', 'beginner'],
  ARRAY['bodyweight'],
  'home',
  ARRAY[2, 3],
  'full_body',
  35,
  ARRAY['none'],
  ARRAY['Arm circles (60s)', 'Cat-Cow (8 reps)', 'Hip openers (10 per leg)', 'Light squats (10 reps)'],
  ARRAY['Allow at least 48 hours between full-body days.', 'Minimum 2.5L water daily.'],
  'approved',
  'Senior Exercise Physiologist (FIT Planner Medical Board)',
  '2026-11-20T10:00:00Z',
  '[]'::jsonb
),
(
  'template_beginner_home_dumbbells',
  'Beginner Home Dumbbell Full-Body',
  'Progressive home resistance program using only a pair of dumbbells. Builds lean muscle and increases functional strength.',
  ARRAY['build_muscle', 'improve_fitness', 'gain_weight', 'lose_weight'],
  ARRAY['beginner', 'intermediate'],
  ARRAY['dumbbells'],
  'home',
  ARRAY[3],
  'full_body',
  40,
  ARRAY['none'],
  ARRAY['Shoulder dislocates (60s)', 'Hip rotations (10 reps)', 'Inchworms (5 reps)'],
  ARRAY['Drink 3L water on lifting days.', '25-30g protein post-workout.'],
  'approved',
  'Senior Exercise Physiologist (FIT Planner Medical Board)',
  '2026-11-20T10:00:00Z',
  '[]'::jsonb
),
(
  'template_knee_safe_protocol',
  'Joint-Safe Protocol: Knee Protection & Hypertrophy',
  'Clinically structured for members with knee sensitivity. Zero deep knee shear, plyometrics, or jumping.',
  ARRAY['build_muscle', 'improve_fitness', 'lose_weight', 'maintain'],
  ARRAY['beginner', 'intermediate', 'advanced'],
  ARRAY['bodyweight', 'dumbbells'],
  'both',
  ARRAY[3],
  'full_body',
  40,
  ARRAY['knee'],
  ARRAY['Glute bridges (2x15)', 'Hamstring scoops', 'Band pull-aparts'],
  ARRAY['Avoid all jumping and deep squats past 90 degrees.'],
  'approved',
  'Sports Medicine & Orthopedic Physical Therapy Advisor',
  '2026-11-20T10:00:00Z',
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  review_status = EXCLUDED.review_status,
  updated_at = NOW();
