"use client";

import React from "react";
import { Check, X, Globe } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageOption } from "@/lib/i18n/LanguageContext";

export function LanguageModal() {
  const { currentLanguage, setLanguage, isLanguageModalOpen, setIsLanguageModalOpen } =
    useLanguage();

  if (!isLanguageModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-[#121218] dark:bg-[#121218] light:bg-[#FFFFFF] text-white light:text-[#0F172A] border border-white/10 light:border-gray-200 shadow-2xl p-5 select-none">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 light:border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#28DACC]/15 text-[#28DACC] flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white light:text-[#0F172A]">Choose Language</h3>
              <p className="text-[10px] text-[#8E8E93] light:text-gray-500">
                Select your preferred interface language
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 light:hover:bg-gray-100 text-[#8E8E93] light:text-gray-500 hover:text-white light:hover:text-black transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="py-3 space-y-1 max-h-[320px] overflow-y-auto no-scrollbar">
          {SUPPORTED_LANGUAGES.map((lang: LanguageOption) => {
            const isSelected = currentLanguage.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all ${
                  isSelected
                    ? "bg-[#28DACC]/15 text-[#28DACC] font-bold border border-[#28DACC]/40"
                    : "hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{lang.flag}</span>
                  <div className="text-left">
                    <span className="block font-semibold text-white light:text-gray-900">
                      {lang.localName}
                    </span>
                    <span className="block text-[10px] text-[#8E8E93] light:text-gray-500">
                      {lang.name}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#28DACC] text-black flex items-center justify-center font-bold">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
