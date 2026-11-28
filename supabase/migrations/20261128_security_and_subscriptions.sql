-- Migration: 20261128_security_and_subscriptions.sql
-- Purpose: Subscriptions table, billing idempotency, sandbox session control, and profile privilege-escalation protection.

-- 1. Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_subscription_id TEXT,
  is_sandbox BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'unconfigured', 'trialing')),
  tier_months INT NOT NULL CHECK (tier_months IN (1, 3, 6)),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'Users view own subscriptions'
  ) THEN
    CREATE POLICY "Users view own subscriptions" ON public.subscriptions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 2. Server-side Sandbox Checkout Sessions (service_role only; zero client access)
CREATE TABLE IF NOT EXISTS public.sandbox_checkout_sessions (
  session_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  tier_months INT NOT NULL CHECK (tier_months IN (1, 3, 6)),
  currency TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.sandbox_checkout_sessions ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies for anon/authenticated: only service_role may access.

-- 3. Billing Webhook Idempotency & Replay Protection (service_role only)
CREATE TABLE IF NOT EXISTS public.billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_sandbox BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies for anon/authenticated: only service_role may access.

-- 4. Unique index on member_assessments(user_id) for safe upserts
CREATE UNIQUE INDEX IF NOT EXISTS member_assessments_user_id_idx
  ON public.member_assessments(user_id);

-- 5. Prevent ordinary users from escalating role or membership_status on public.profiles
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF current_user IN ('service_role', 'postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify role';
  END IF;

  IF NEW.membership_status IS DISTINCT FROM OLD.membership_status THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify membership_status';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 6. Harden SECURITY DEFINER functions with explicit search_path
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
