"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "fit_planner_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  // Apply theme class to document
  const applyTheme = (targetTheme: ResolvedTheme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(targetTheme);
    root.setAttribute("data-theme", targetTheme);
    root.style.colorScheme = targetTheme;
  };

  useEffect(() => {
    // Read saved theme from localStorage
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const initialTheme: Theme = saved || "dark";
    setThemeState(initialTheme);

    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialResolved: ResolvedTheme =
      initialTheme === "system" ? (systemIsDark ? "dark" : "light") : initialTheme;

    setResolvedTheme(initialResolved);
    applyTheme(initialResolved);
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const current = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (current === "system") {
        const nextResolved: ResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        applyTheme(nextResolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    let nextResolved: ResolvedTheme;
    if (newTheme === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      nextResolved = systemIsDark ? "dark" : "light";
    } else {
      nextResolved = newTheme;
    }

    setResolvedTheme(nextResolved);
    applyTheme(nextResolved);
  };

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
