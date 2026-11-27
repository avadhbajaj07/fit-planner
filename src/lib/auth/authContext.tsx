"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "customer" | "coach" | "support" | "admin";
  isDemoAccount: boolean;
  membershipStatus: "unconfigured" | "free" | "active" | "expired";
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  loginAsAdminDemo: () => void;
  loginWithGoogle: (nextTarget?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: "demo_athlete_01",
  email: "athlete@demo.fitplanner.app",
  fullName: "Alex Rivera",
  role: "customer",
  isDemoAccount: true,
  membershipStatus: "active",
  createdAt: "2026-11-17T00:00:00Z"
};

const DEMO_ADMIN: UserProfile = {
  id: "demo_admin_01",
  email: "admin@fitplanner.app",
  fullName: "System Administrator",
  role: "admin",
  isDemoAccount: true,
  membershipStatus: "active",
  createdAt: "2026-11-17T00:00:00Z"
};

export const USER_STORAGE_KEY = "fit_planner_active_user";

export function syncAuthCookies(profile: UserProfile | null) {
  if (typeof document === "undefined") return;
  if (profile) {
    document.cookie = "fit_planner_session=active; path=/; max-age=604800; SameSite=Lax";
    document.cookie = `fit_planner_role=${profile.role}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = "fit_planner_session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "fit_planner_role=; path=/; max-age=0; SameSite=Lax";
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAndSyncUser = (u: UserProfile | null) => {
    setUser(u);
    syncAuthCookies(u);
    if (u) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  // Sync session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        // 1. Try local storage first for instant optimistic load
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored && mounted) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          syncAuthCookies(parsed);
        }

        // 2. If Supabase is available, sync live session
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            // Fetch live profile from public.profiles
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle();

            const liveUser: UserProfile = {
              id: session.user.id,
              email: session.user.email || "",
              fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Athlete",
              role: profile?.role || "customer",
              isDemoAccount: false,
              membershipStatus: profile?.membership_status || "free",
              createdAt: profile?.created_at || session.user.created_at
            };

            setAndSyncUser(liveUser);
          }
        }
      } catch (e) {
        console.error("Failed to read user session", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    // Listen to Supabase auth state changes
    if (supabase) {
      const client = supabase;
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setAndSyncUser(null);
        } else if (session?.user) {
          const { data: profile } = await client
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          const liveUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || "",
            fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Athlete",
            role: profile?.role || "customer",
            isDemoAccount: false,
            membershipStatus: profile?.membership_status || "active",
            createdAt: session.user.created_at
          };
          setAndSyncUser(liveUser);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

          const loggedUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: profile?.full_name || data.user.user_metadata?.full_name || email.split("@")[0],
            role: profile?.role || "customer",
            isDemoAccount: false,
            membershipStatus: profile?.membership_status || "active",
            createdAt: data.user.created_at
          };
          setAndSyncUser(loggedUser);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err?.message || "Login failed" };
      }
    }

    // Fallback demo login
    const newUser: UserProfile = {
      id: `user_${Date.now().toString(36)}`,
      email,
      fullName: email.split("@")[0],
      role: email.toLowerCase().includes("admin") ? "admin" : "customer",
      isDemoAccount: true,
      membershipStatus: "active",
      createdAt: new Date().toISOString()
    };
    setAndSyncUser(newUser);
    return { success: true };
  };

  const signup = async (
    email: string,
    pass: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass,
          options: {
            data: {
              full_name: name || "Athlete"
            }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: name || email.split("@")[0],
            role: "customer",
            isDemoAccount: false,
            membershipStatus: "free",
            createdAt: data.user.created_at
          };
          setAndSyncUser(newUser);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err?.message || "Sign up failed" };
      }
    }

    const fallbackUser: UserProfile = {
      id: `user_${Date.now().toString(36)}`,
      email,
      fullName: name || "Athlete",
      role: "customer",
      isDemoAccount: true,
      membershipStatus: "free",
      createdAt: new Date().toISOString()
    };
    setAndSyncUser(fallbackUser);
    return { success: true };
  };

  const loginAsDemo = () => {
    setAndSyncUser(DEMO_USER);
  };

  const loginAsAdminDemo = () => {
    setAndSyncUser(DEMO_ADMIN);
  };

  const loginWithGoogle = async (
    nextTarget?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase || !isSupabaseConfigured) {
      return {
        success: false,
        error: "Supabase authentication is not configured in this environment."
      };
    }

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const callbackUrl = new URL("/auth/callback", origin);
      if (nextTarget && nextTarget.startsWith("/") && !nextTarget.startsWith("//")) {
        callbackUrl.searchParams.set("next", nextTarget);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: "offline",
            prompt: "select_account"
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.url && typeof window !== "undefined") {
        window.location.assign(data.url);
      }

      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Failed to initiate Google authentication"
      };
    }
  };

  const loginWithFacebook = async () => {
    if (supabase && isSupabaseConfigured) {
      try {
        const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/app/today` : undefined;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "facebook",
          options: { redirectTo: redirectUrl }
        });
        if (!error) return;
      } catch (e) {
        console.warn("Live Facebook OAuth not active, falling back to authenticated demo profile", e);
      }
    }

    const fbUser: UserProfile = {
      id: "fb_verified_athlete",
      email: "athlete@shaperadar.app",
      fullName: "Alex Rivera",
      role: "customer",
      isDemoAccount: true,
      membershipStatus: "active",
      createdAt: new Date().toISOString()
    };
    setAndSyncUser(fbUser);
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setAndSyncUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseConfigured,
        login,
        signup,
        loginAsDemo,
        loginAsAdminDemo,
        loginWithGoogle,
        loginWithFacebook,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
