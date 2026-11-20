"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LanguageOption {
  code: string;
  name: string;
  localName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", localName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", localName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", localName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", localName: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", localName: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Portuguese", localName: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italian", localName: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", localName: "日本語", flag: "🇯🇵" }
];

interface LanguageContextType {
  currentLanguage: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = "fit_planner_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved) {
      const found = SUPPORTED_LANGUAGES.find((l) => l.code === saved);
      if (found) setCurrentLanguage(found);
    }
  }, []);

  const setLanguage = (lang: LanguageOption) => {
    setCurrentLanguage(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang.code);
    setIsLanguageModalOpen(false);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        isLanguageModalOpen,
        setIsLanguageModalOpen
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
