"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Sparkles,
  ExternalLink,
  Users,
  KeyRound,
  Check
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/authContext";

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSocialLogin?: () => void;
}

export function UserProfileMenu({
  isOpen,
  onClose,
  onOpenSocialLogin
}: UserProfileMenuProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { currentLanguage, setIsLanguageModalOpen } = useLanguage();
  const { user, logout, loginWithGoogle, loginWithFacebook } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Floating Popup Menu matching Hostinger reference (Screenshots 1 & 3) */}
      <div className="fixed top-14 right-3 sm:right-6 z-50 w-[310px] max-w-[calc(100vw-24px)] rounded-3xl bg-[#121218] dark:bg-[#121218] light:bg-[#FFFFFF] text-white light:text-[#0F172A] border border-white/10 light:border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 text-xs select-none animate-in fade-in zoom-in-95 duration-150">
        {/* User Identity Header */}
        <div className="pb-3 border-b border-white/10 light:border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#28DACC] to-[#6366F1] flex items-center justify-center font-bold text-black text-sm shadow-[0_0_12px_rgba(40,218,204,0.3)] shrink-0">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
            </div>
            <div className="truncate">
              <div className="font-bold text-sm text-white light:text-[#0F172A] truncate">
                {user?.fullName || "Maruti Digital"}
              </div>
              <div className="text-[11px] text-[#8E8E93] light:text-gray-500 truncate">
                {user?.email || "avadhshikha@gmail.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2 space-y-0.5">
          <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5 text-[#E0E0E0] light:text-[#1F2937]">
              <Sparkles size={15} className="text-[#28DACC]" />
              <span>FIT Credits</span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-[#8E8E93] light:text-gray-500">
              43
            </span>
          </div>

          <Link
            href="/membership"
            onClick={onClose}
            className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-[#E0E0E0] light:text-[#1F2937]">
              <CreditCard size={15} />
              <span>Billing & Plan</span>
            </div>
            <span className="w-4 h-4 rounded-full bg-[#E11D48] text-white text-[9px] font-bold flex items-center justify-center">
              1
            </span>
          </Link>

          <Link
            href="/app/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-[#1F2937] transition-colors"
          >
            <User size={15} />
            <span>Account information</span>
          </Link>

          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-[#1F2937] transition-colors cursor-pointer">
            <Users size={15} />
            <span>Account sharing</span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-[#1F2937] transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Shield size={15} />
              <span>Security</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
          </div>

          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-[#1F2937] transition-colors cursor-pointer">
            <Bell size={15} />
            <span>Notification settings</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-1.5 border-t border-white/10 light:border-gray-100" />

        {/* Language & Theme Section */}
        <div className="py-1 space-y-2">
          {/* Language Selector */}
          <button
            type="button"
            onClick={() => {
              setIsLanguageModalOpen(true);
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-white/5 light:hover:bg-gray-100 text-[#E0E0E0] light:text-[#1F2937] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe size={15} className="text-[#28DACC]" />
              <span>Language</span>
            </div>
            <span className="text-[11px] text-[#8E8E93] light:text-gray-500 font-medium flex items-center gap-1">
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.name}</span>
            </span>
          </button>

          {/* Theme Segmented Control (Light / Dark / System) - Matches Hostinger reference */}
          <div className="flex items-center justify-between px-2.5 py-1">
            <div className="flex items-center gap-2.5 text-[#E0E0E0] light:text-[#1F2937]">
              {resolvedTheme === "dark" ? (
                <Moon size={15} className="text-[#28DACC]" />
              ) : (
                <Sun size={15} className="text-[#00B4A0]" />
              )}
              <span>Theme</span>
            </div>

            {/* Segmented Pill */}
            <div className="flex items-center p-0.5 rounded-full bg-[#1E1B2E] dark:bg-[#1E1B2E] light:bg-gray-200 border border-white/5 light:border-gray-300">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all ${
                  theme === "light"
                    ? "bg-white text-black shadow-sm"
                    : "text-[#8E8E93] light:text-gray-600 hover:text-white light:hover:text-black"
                }`}
                title="Light mode"
                aria-label="Light mode"
              >
                <Sun size={13} />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all ${
                  theme === "dark"
                    ? "bg-[#28DACC] text-black shadow-sm"
                    : "text-[#8E8E93] light:text-gray-600 hover:text-white light:hover:text-black"
                }`}
                title="Dark mode"
                aria-label="Dark mode"
              >
                <Moon size={13} />
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-all ${
                  theme === "system"
                    ? "bg-white text-black shadow-sm"
                    : "text-[#8E8E93] light:text-gray-600 hover:text-white light:hover:text-black"
                }`}
                title="System theme"
                aria-label="System theme"
              >
                <Monitor size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-1.5 border-t border-white/10 light:border-gray-100" />

        {/* Social Login / Auth Actions */}
        {!user ? (
          <div className="pt-1.5 space-y-1.5">
            <button
              type="button"
              onClick={() => {
                loginWithGoogle();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-100 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Login with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginWithFacebook();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1877F2] text-white font-semibold text-xs hover:bg-[#166FE5] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Login with Facebook</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span className="font-semibold">Log out</span>
          </button>
        )}
      </div>
    </>
  );
}
