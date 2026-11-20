"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CreditCard,
  User,
  Users,
  Shield,
  Activity,
  Bell,
  Cpu,
  Globe,
  Sun,
  Moon,
  Monitor,
  BookOpen,
  HelpCircle,
  LogOut,
  ExternalLink
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/authContext";

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileMenu({ isOpen, onClose }: UserProfileMenuProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { currentLanguage, setIsLanguageModalOpen } = useLanguage();
  const { user, logout, loginWithGoogle, loginWithFacebook } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dropdown Container (width 330px; radius 22; scrollable) */}
      <div
        className="fixed top-14 right-3 sm:right-6 z-50 w-[330px] max-w-[calc(100vw-24px)] max-h-[85vh] overflow-y-auto no-scrollbar rounded-[22px] border shadow-2xl p-4 text-xs select-none animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--bd)",
          color: "var(--tx)",
          boxShadow: "var(--shadow)"
        }}
      >
        {/* User Identity Header */}
        <div className="pb-3 border-b flex items-center justify-between" style={{ borderColor: "var(--bd)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
              style={{ backgroundColor: "var(--pr)" }}
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
            </div>
            <div className="truncate">
              <div className="font-bold text-sm truncate" style={{ color: "var(--tx)" }}>
                {user?.fullName || "Maruti Digital"}
              </div>
              <div className="text-[11px] truncate" style={{ color: "var(--mu)" }}>
                {user?.email || "avadhshikha@gmail.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Rows with Icons */}
        <div className="py-2 space-y-0.5">
          {/* FIT credits (43) */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} style={{ color: "var(--pr)" }} />
              <span>Hostinger Credits</span>
            </div>
            <span className="font-mono text-[11px] font-semibold" style={{ color: "var(--mu)" }}>
              43
            </span>
          </div>

          {/* Billing (red badge 1) */}
          <Link
            href="/membership"
            onClick={onClose}
            className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard size={16} />
              <span>Billing</span>
            </div>
            <span
              className="w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "var(--dg)" }}
            >
              1
            </span>
          </Link>

          {/* Account information */}
          <Link
            href="/app/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <User size={16} />
            <span>Account information</span>
          </Link>

          {/* Account sharing */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <Users size={16} />
            <span>Account sharing</span>
          </div>

          {/* Security */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Shield size={16} />
              <span>Security</span>
            </div>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--dg)" }} />
          </div>

          {/* Account activity */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <Activity size={16} />
            <span>Account activity</span>
          </div>

          {/* Notification settings */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <Bell size={16} />
            <span>Notification settings</span>
          </div>

          {/* AI memory */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <Cpu size={16} />
            <span>AI memory</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-1.5 border-t" style={{ borderColor: "var(--bd)" }} />

        {/* Language & Theme */}
        <div className="py-1 space-y-2">
          {/* Language (English) */}
          <button
            type="button"
            onClick={() => {
              setIsLanguageModalOpen(true);
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe size={16} style={{ color: "var(--pr)" }} />
              <span>Language</span>
            </div>
            <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: "var(--mu)" }}>
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.name}</span>
            </span>
          </button>

          {/* Theme Segmented Control (Light/Dark/System 3-button pill) */}
          <div className="flex items-center justify-between px-2.5 py-1">
            <div className="flex items-center gap-2.5">
              {resolvedTheme === "dark" ? (
                <Moon size={16} style={{ color: "var(--prx)" }} />
              ) : (
                <Sun size={16} style={{ color: "var(--pr)" }} />
              )}
              <span>Theme</span>
            </div>

            <div
              className="flex items-center p-0.5 rounded-full border"
              style={{
                backgroundColor: "var(--pill)",
                borderColor: "var(--bd)"
              }}
            >
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all ${
                  theme === "light"
                    ? "bg-white text-black shadow-sm"
                    : "text-[#6D7081] hover:text-black dark:text-[#A8A5B5] dark:hover:text-white"
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
                    ? "bg-[#673DE6] text-white shadow-sm"
                    : "text-[#6D7081] hover:text-black dark:text-[#A8A5B5] dark:hover:text-white"
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
                    : "text-[#6D7081] hover:text-black dark:text-[#A8A5B5] dark:hover:text-white"
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
        <div className="my-1.5 border-t" style={{ borderColor: "var(--bd)" }} />

        {/* Secondary Links: Learning Lab & Hire an expert */}
        <div className="py-1 space-y-0.5">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <BookOpen size={16} />
              <span>Learning Lab</span>
            </div>
            <ExternalLink size={13} style={{ color: "var(--mu)" }} />
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <HelpCircle size={16} />
              <span>Hire an expert</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-1.5 border-t" style={{ borderColor: "var(--bd)" }} />

        {/* Log In / Log Out */}
        {!user ? (
          <div className="pt-1.5 space-y-1.5">
            <button
              type="button"
              onClick={() => {
                loginWithGoogle();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white text-black font-semibold text-xs hover:bg-gray-100 transition-colors shadow-sm"
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
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1877F2] text-white font-semibold text-xs hover:bg-[#166FE5] transition-colors shadow-sm"
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
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#D63163] hover:bg-[#D63163]/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span className="font-semibold">Log out</span>
          </button>
        )}
      </div>
    </>
  );
}
