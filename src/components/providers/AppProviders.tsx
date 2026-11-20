"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth/authContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
