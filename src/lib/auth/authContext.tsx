"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: "demo_athlete_01",
  email: "athlete@demo.fitplanner.app",
  fullName: "Alex Rivera",
  role: "customer",
  isDemoAccount: true,
  membershipStatus: "unconfigured",
  createdAt: "2026-11-17T00:00:00Z"
};

const USER_STORAGE_KEY = "fit_planner_active_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if Supabase keys are in env
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read user session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      // In local development / demo mode
      const newUser: UserProfile = {
        id: `user_${Date.now().toString(36)}`,
        email,
        fullName: email.split("@")[0],
        role: "customer",
        isDemoAccount: true,
        membershipStatus: "unconfigured",
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      return { success: true };
    }

    return {
      success: false,
      error: "Supabase connection requires live environment configuration."
    };
  };

  const signup = async (
    email: string,
    pass: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      const newUser: UserProfile = {
        id: `user_${Date.now().toString(36)}`,
        email,
        fullName: name || "Athlete",
        role: "customer",
        isDemoAccount: true,
        membershipStatus: "unconfigured",
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      return { success: true };
    }

    return {
      success: false,
      error: "Supabase connection requires live environment configuration."
    };
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
  };

  const loginWithGoogle = async () => {
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

  const logout = () => {
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
