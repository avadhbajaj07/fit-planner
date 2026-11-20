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

const THEME_STORAGE_KEY = "shape_radar_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  const applyTheme = (targetTheme: ResolvedTheme, activeSetting: Theme) => {
    try {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(targetTheme);
      root.setAttribute("data-theme", targetTheme);
      root.style.colorScheme = targetTheme;

      // Update meta theme-color
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement("meta");
        metaTheme.setAttribute("name", "theme-color");
        document.head.appendChild(metaTheme);
      }
      metaTheme.setAttribute(
        "content",
        targetTheme === "dark" ? "#07151D" : "#F2F3F6"
      );
    } catch (e) {
      console.warn("Theme application failed:", e);
    }
  };

  useEffect(() => {
    let saved: Theme | null = null;
    try {
      saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    } catch (e) {
      console.warn("Could not read theme from localStorage:", e);
    }

    const initialTheme: Theme = saved || "dark";
    setThemeState(initialTheme);

    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialResolved: ResolvedTheme =
      initialTheme === "system" ? (systemIsDark ? "dark" : "light") : initialTheme;

    setResolvedTheme(initialResolved);
    applyTheme(initialResolved, initialTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      let currentChoice: Theme | null = null;
      try {
        currentChoice = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      } catch (err) {
        // ignore
      }
      if (currentChoice === "system") {
        const nextResolved: ResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        applyTheme(nextResolved, "system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Could not write theme to localStorage:", e);
    }

    let nextResolved: ResolvedTheme;
    if (newTheme === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      nextResolved = systemIsDark ? "dark" : "light";
    } else {
      nextResolved = newTheme;
    }

    setResolvedTheme(nextResolved);
    applyTheme(nextResolved, newTheme);
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
