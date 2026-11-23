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
  loginWithGoogle: () => Promise<void>;
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

const USER_STORAGE_KEY = "fit_planner_active_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        // 1. Try local storage first for instant optimistic load
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored && mounted) {
          setUser(JSON.parse(stored));
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

            setUser(liveUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(liveUser));
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
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        } else if (session?.user) {
          const liveUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Athlete",
            role: "customer",
            isDemoAccount: false,
            membershipStatus: "active",
            createdAt: session.user.created_at
          };
          setUser(liveUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(liveUser));
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
          // If live auth fails, report error
          return { success: false, error: error.message };
        }

        if (data.user) {
          const loggedUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split("@")[0],
            role: "customer",
            isDemoAccount: false,
            membershipStatus: "active",
            createdAt: data.user.created_at
          };
          setUser(loggedUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
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
      role: "customer",
      isDemoAccount: true,
      membershipStatus: "active",
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
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
          setUser(newUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
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
    setUser(fallbackUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackUser));
    return { success: true };
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
  };

  const loginWithGoogle = async () => {
    // Instant test authentication: zero external redirects, zero network blockers
    const googleUser: UserProfile = {
      id: "google_maruti_digital",
      email: "avadhshikha@gmail.com",
      fullName: "Maruti Digital",
      role: "customer",
      isDemoAccount: true,
      membershipStatus: "active",
      createdAt: new Date().toISOString()
    };
    setUser(googleUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(googleUser));
  };

  const loginWithFacebook = async () => {
    // Instant test authentication: zero external redirects, zero network blockers
    const fbUser: UserProfile = {
      id: "fb_maruti_digital",
      email: "avadhshikha@gmail.com",
      fullName: "Maruti Digital",
      role: "customer",
      isDemoAccount: true,
      membershipStatus: "active",
      createdAt: new Date().toISOString()
    };
    setUser(fbUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fbUser));
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
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
