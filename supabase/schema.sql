-- ==============================================================================
-- SHAPE RADAR / FIT PLANNER — COMPLETE MASTER SUPABASE SCHEMA (V2.0)
-- ==============================================================================
-- Designed for: PostgreSQL 15+ / Supabase
-- Features:
--   1. Secure Auth & Profile Sync (triggers on auth.users)
--   2. GDPR / Swiss FADP Health & Medical Consent Records
--   3. 22-Question Dynamic Fitness Assessment Storage
--   4. Master RepDB Exercise Library (708 Exercises, WebP Illustrations)
--   5. Clinically Approved Workout Templates (Home, Gym, Joint-Safe Protocols)
--   6. Deterministic Member Workout Plans (Weekly 7-Day Sessions)
--   7. Interactive Set Logging & Progression History
--   8. Nutrition & Macro Target Prescriptions
--   9. Strict Row Level Security (RLS) Policies on Every Table
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES (Synced with Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'coach', 'support', 'admin')),
  membership_status TEXT NOT NULL DEFAULT 'unconfigured' CHECK (membership_status IN ('unconfigured', 'free', 'trial', 'active', 'cancelled', 'past_due')),
  membership_tier TEXT DEFAULT 'yearly',
  is_demo_account BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatic Profile Creation Trigger on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 2. HEALTH & MEDICAL CONSENT RECORDS (GDPR / Swiss FADP Compliance)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  protocol_version TEXT NOT NULL DEFAULT '2.0',
  medical_disclaimer_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  sensitive_health_data_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- ==============================================================================
-- 3. MEMBER ASSESSMENTS (22-Question Dynamic Questionnaire)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.member_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '2.0',
  is_completed BOOLEAN NOT NULL DEFAULT TRUE,
  gender TEXT CHECK (gender IN ('male', 'female', 'prefer_not_to_say')),
  age INT,
  age_bracket TEXT,
  goal TEXT NOT NULL,
  fitness_level TEXT NOT NULL,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  target_weight_kg NUMERIC,
  body_shape TEXT,
  location TEXT CHECK (location IN ('home', 'gym', 'both')),
  equipment TEXT[] NOT NULL DEFAULT '{}',
  days_per_week INT NOT NULL DEFAULT 3,
  duration_minutes INT NOT NULL DEFAULT 40,
  restrictions TEXT[] NOT NULL DEFAULT '{}',
  diet_type TEXT,
  muscle_focus TEXT[] DEFAULT '{}',
  raw_answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. MASTER EXERCISE LIBRARY (RepDB 708 Exercises & WebP Illustrations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('strength', 'stretching', 'cardio', 'plyometrics', 'olympic')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  body_part TEXT,
  force_type TEXT,
  mechanic TEXT,
  primary_muscles TEXT[] NOT NULL DEFAULT '{}',
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment_needed TEXT[] NOT NULL DEFAULT '{}',
  raw_equipment TEXT,
  is_bodyweight BOOLEAN DEFAULT FALSE,
  is_unilateral BOOLEAN DEFAULT FALSE,
  start_image TEXT,
  peak_image TEXT,
  main_image TEXT,
  instructions TEXT[] DEFAULT '{}',
  tips TEXT[] DEFAULT '{}',
  safety_notes TEXT,
  contraindications TEXT[] DEFAULT '{}',
  is_low_impact BOOLEAN DEFAULT FALSE,
  default_sets INT DEFAULT 3,
  default_reps TEXT DEFAULT '10-12',
  default_rest_seconds INT DEFAULT 60,
  review_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (review_status IN ('approved', 'pending_review', 'rejected')),
  source_provider TEXT DEFAULT 'RepDB',
  source_version TEXT DEFAULT '1.0',
  attribution TEXT DEFAULT 'Exercise data by RepDB (repdb.co)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant search and filtering
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscles ON public.exercises USING GIN(primary_muscles);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises USING GIN(equipment_needed);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_review_status ON public.exercises(review_status);

-- ==============================================================================
-- 5. CLINICALLY APPROVED WORKOUT TEMPLATES
-- ==============================================================================
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
  sessions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. MEMBER PERSONALIZED WORKOUT PLANS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.member_workout_plans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id TEXT REFERENCES public.workout_templates(id),
  assessment_id UUID REFERENCES public.member_assessments(id),
  goal TEXT NOT NULL,
  fitness_level TEXT NOT NULL,
  split TEXT NOT NULL,
  days_per_week INT NOT NULL,
  duration_minutes INT NOT NULL,
  is_restricted_mode BOOLEAN NOT NULL DEFAULT FALSE,
  safety_notice TEXT,
  rationale TEXT[] DEFAULT '{}',
  weekly_sessions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_plans_user ON public.member_workout_plans(user_id);

-- ==============================================================================
-- 7. WORKOUT LOGS & PROGRESSION HISTORY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES public.member_workout_plans(id),
  session_id TEXT NOT NULL,
  session_title TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  exercise_logs_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  rpe_rating INT,
  notes TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_completed_at ON public.workout_logs(completed_at);

-- ==============================================================================
-- 8. NUTRITION & MACRO TARGET PRESCRIPTIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.member_nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.member_assessments(id),
  daily_calories INT NOT NULL,
  protein_grams INT NOT NULL,
  carbs_grams INT NOT NULL,
  fats_grams INT NOT NULL,
  water_liters NUMERIC NOT NULL DEFAULT 3.0,
  diet_type TEXT NOT NULL DEFAULT 'flexible',
  meals_per_day INT DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nutrition_user ON public.member_nutrition_plans(user_id);

-- ==============================================================================
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_nutrition_plans ENABLE ROW LEVEL SECURITY;

-- Helper function: Is user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- CONSENT RECORDS
DROP POLICY IF EXISTS "Users can view own consent" ON public.consent_records;
CREATE POLICY "Users can view own consent" ON public.consent_records
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own consent" ON public.consent_records;
CREATE POLICY "Users can insert own consent" ON public.consent_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ASSESSMENTS
DROP POLICY IF EXISTS "Users can view own assessments" ON public.member_assessments;
CREATE POLICY "Users can view own assessments" ON public.member_assessments
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert/update own assessments" ON public.member_assessments;
CREATE POLICY "Users can insert/update own assessments" ON public.member_assessments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- EXERCISES (Public read for approved, admin read/write all)
DROP POLICY IF EXISTS "Public can view approved exercises" ON public.exercises;
CREATE POLICY "Public can view approved exercises" ON public.exercises
  FOR SELECT USING (review_status = 'approved' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage exercises" ON public.exercises;
CREATE POLICY "Admins can manage exercises" ON public.exercises
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- WORKOUT TEMPLATES
DROP POLICY IF EXISTS "Public can view approved templates" ON public.workout_templates;
CREATE POLICY "Public can view approved templates" ON public.workout_templates
  FOR SELECT USING (review_status = 'approved' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage templates" ON public.workout_templates;
CREATE POLICY "Admins can manage templates" ON public.workout_templates
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- MEMBER WORKOUT PLANS
DROP POLICY IF EXISTS "Users can view own workout plans" ON public.member_workout_plans;
CREATE POLICY "Users can view own workout plans" ON public.member_workout_plans
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert/update own workout plans" ON public.member_workout_plans;
CREATE POLICY "Users can insert/update own workout plans" ON public.member_workout_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WORKOUT LOGS
DROP POLICY IF EXISTS "Users can view own workout logs" ON public.workout_logs;
CREATE POLICY "Users can view own workout logs" ON public.workout_logs
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own workout logs" ON public.workout_logs;
CREATE POLICY "Users can insert own workout logs" ON public.workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NUTRITION PLANS
DROP POLICY IF EXISTS "Users can view own nutrition plans" ON public.member_nutrition_plans;
CREATE POLICY "Users can view own nutrition plans" ON public.member_nutrition_plans
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert/update own nutrition plans" ON public.member_nutrition_plans;
CREATE POLICY "Users can insert/update own nutrition plans" ON public.member_nutrition_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 10. SEED CANONICAL APPROVED TEMPLATES
-- ==============================================================================
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
  'template_beginner_gym_full_body',
  'Gym Beginner Machine & Free-Weight Split',
  'Designed for commercial gym access. Combines safe machine guidance with foundational free weights.',
  ARRAY['build_muscle', 'improve_fitness', 'lose_weight'],
  ARRAY['beginner'],
  ARRAY['fully_equipped_gym'],
  'gym',
  ARRAY[3, 4],
  'full_body',
  45,
  ARRAY['none'],
  ARRAY['5 min rowing machine', 'Dynamic hip & shoulder stretches'],
  ARRAY['Ensure 7-8 hours sleep for neuro-muscular adaptation.'],
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
),
(
  'template_back_safe_protocol',
  'Joint-Safe Protocol: Spinal Sparing & Lumbar Protection',
  'Built for members with lower back sensitivity. Strictly eliminates axial spinal compression and bent-over deadlifts.',
  ARRAY['improve_fitness', 'build_muscle', 'maintain'],
  ARRAY['beginner', 'intermediate'],
  ARRAY['bodyweight', 'dumbbells'],
  'both',
  ARRAY[3],
  'full_body',
  35,
  ARRAY['back'],
  ARRAY['Cat-Cow gentle cycles', 'Bird-Dog (8 reps per side)', 'Glute bridges (10 reps)'],
  ARRAY['Never round lower back when lifting everyday objects.'],
  'approved',
  'Sports Medicine & Orthopedic Physical Therapy Advisor',
  '2026-11-20T10:00:00Z',
  '[]'::jsonb
),
(
  'template_shoulder_safe_protocol',
  'Joint-Safe Protocol: Shoulder & Rotator Cuff Sparing',
  'Formulated for members with impingement or anterior shoulder pain. Eliminates overhead barbell pressing and dips.',
  ARRAY['build_muscle', 'improve_fitness', 'maintain'],
  ARRAY['beginner', 'intermediate'],
  ARRAY['bodyweight', 'dumbbells'],
  'both',
  ARRAY[3],
  'full_body',
  40,
  ARRAY['shoulder'],
  ARRAY['Band external rotations (2x15)', 'Scapular push-ups (10 reps)'],
  ARRAY['Keep pressing movements neutral-grip and strictly pain-free.'],
  'approved',
  'Sports Medicine & Orthopedic Physical Therapy Advisor',
  '2026-11-20T10:00:00Z',
  '[]'::jsonb
),
(
  'template_intermediate_gym_ppl',
  'Classic Gym Push / Pull / Legs Hypertrophy',
  'The gold standard hypertrophy split for gym members. Targets synergistic muscle groups with optimal volume.',
  ARRAY['build_muscle', 'gain_weight'],
  ARRAY['intermediate', 'advanced'],
  ARRAY['fully_equipped_gym'],
  'gym',
  ARRAY[4, 5],
  'push_pull_legs',
  50,
  ARRAY['none'],
  ARRAY['Band pull-aparts', '2 progressive warm-up sets on first compound movement'],
  ARRAY['Prioritize 1.6-2.2g protein per kg bodyweight.'],
  'approved',
  'Senior Exercise Physiologist (FIT Planner Medical Board)',
  '2026-11-20T10:00:00Z',
  '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  review_status = EXCLUDED.review_status,
  updated_at = NOW();
