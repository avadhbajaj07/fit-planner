import crypto from "crypto";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

/**
 * Extracts and verifies the authenticated Supabase user from Authorization header
 * or Supabase auth cookies. Never trusts client-supplied userId in request body.
 */
export async function getAuthenticatedSupabaseUser(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  let accessToken: string | null = null;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    accessToken = authHeader.slice(7).trim();
  }

  if (!accessToken) {
    // Check Supabase auth cookie(s)
    const allCookies = req.cookies.getAll();
    const sbCookie = allCookies.find(
      (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );
    if (sbCookie?.value) {
      try {
        let raw = sbCookie.value;
        if (raw.startsWith("base64-")) {
          raw = Buffer.from(raw.slice(7), "base64").toString("utf-8");
        } else {
          raw = decodeURIComponent(raw);
        }
        const parsed = JSON.parse(raw);
        accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token || null;
      } catch {
        // Fallback: cookie might be raw JWT
        if (sbCookie.value.split(".").length === 3) {
          accessToken = sbCookie.value;
        }
      }
    }
  }

  if (!accessToken) return null;

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) return null;
  return data.user;
}

/**
 * Determines whether sandbox billing is permitted for the current environment & user.
 * In production (VERCEL_ENV === 'production'), sandbox is hard-blocked unless
 * ENABLE_SANDBOX_BILLING === 'true' AND userEmail is in SANDBOX_TEST_EMAILS.
 */
export function isSandboxAllowed(userEmail?: string | null): { allowed: boolean; reason?: string } {
  const vercelEnv = process.env.VERCEL_ENV;
  const isProd = vercelEnv === "production";

  if (isProd) {
    if (process.env.ENABLE_SANDBOX_BILLING !== "true") {
      return { allowed: false, reason: "Sandbox billing is disabled in production." };
    }
    const allowList = (process.env.SANDBOX_TEST_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!userEmail || !allowList.includes(userEmail.toLowerCase())) {
      return { allowed: false, reason: "User is not an authorized sandbox tester." };
    }
    return { allowed: true };
  }

  // Preview or local development: require authenticated user, and respect allowlist if set
  const allowList = (process.env.SANDBOX_TEST_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowList.length > 0 && (!userEmail || !allowList.includes(userEmail.toLowerCase()))) {
    return { allowed: false, reason: "User is not in SANDBOX_TEST_EMAILS." };
  }

  return { allowed: true };
}

function getSandboxSigningSecret(): string | null {
  if (process.env.SANDBOX_WEBHOOK_SECRET) {
    return process.env.SANDBOX_WEBHOOK_SECRET;
  }
  if (process.env.VERCEL_ENV === "production") {
    // Fail closed in production if no explicit secret is configured
    return null;
  }
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function signSandboxWebhook(rawBody: string, timestampSec?: number): string | null {
  const secret = getSandboxSigningSecret();
  if (!secret) return null;
  const ts = timestampSec ?? Math.floor(Date.now() / 1000);
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${rawBody}`)
    .digest("hex");
  return `t=${ts},v1=${sig}`;
}

export function verifySandboxWebhookSignature(
  rawBody: string,
  signatureHeader: string
): { valid: boolean; error?: string } {
  const secret = getSandboxSigningSecret();
  if (!secret) {
    return { valid: false, error: "Sandbox webhook secret is not configured." };
  }
  if (!signatureHeader) {
    return { valid: false, error: "Missing sandbox signature header." };
  }

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k?.trim(), v?.trim()];
    })
  );

  const ts = Number(parts.t);
  const v1 = parts.v1;
  if (!ts || !v1 || Number.isNaN(ts)) {
    return { valid: false, error: "Malformed sandbox signature header." };
  }

  // Replay protection: reject signatures older than 5 minutes (300s)
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > 300) {
    return { valid: false, error: "Webhook signature timestamp expired (replay protection)." };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${rawBody}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(v1, "utf8");

  if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
    return { valid: false, error: "Invalid sandbox webhook HMAC signature." };
  }

  return { valid: true };
}
