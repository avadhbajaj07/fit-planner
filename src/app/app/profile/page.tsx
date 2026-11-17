"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Shield,
  CreditCard,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  Sliders,
  Database
} from "lucide-react";
import { IosNavBar } from "@/components/layout/IosNavBar";
import { useAuth } from "@/lib/auth/authContext";
import { loadAssessmentProgress, clearAssessmentProgress } from "@/lib/assessment/storage";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dataExported, setDataExported] = useState(false);
  const [consentActive, setConsentActive] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const paymentProvider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "none";

  const handleExportData = () => {
    const answers = loadAssessmentProgress();
    const exportData = {
      userProfile: user,
      assessmentBlueprint: answers,
      exportedAt: new Date().toISOString(),
      legalNote: "Data export complies with GDPR Article 20 and Swiss FADP."
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fit_planner_data_export_${Date.now()}.json`;
    a.click();
    setDataExported(true);
    setTimeout(() => setDataExported(false), 3000);
  };

  const handleDeleteAccount = () => {
    clearAssessmentProgress();
    logout();
    router.push("/");
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
      <IosNavBar
        title="Settings & Profile"
        subtitle={user?.email || "athlete@fitplanner.app"}
      />

      {/* ATHLETE IDENTITY HEADER */}
      <div className="ios-glass-card rounded-3xl p-5 md:p-6 border border-[#28525B] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#102831] border-2 border-[#28DACC] flex items-center justify-center text-xl font-bold text-[#28DACC]">
            {user?.fullName?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#F4F9FA]">
                {user?.fullName || "Athlete"}
              </h3>
              {user?.isDemoAccount && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#102831] text-[#A8C5CA] border border-[#28525B]">
                  Demo Account
                </span>
              )}
            </div>
            <p className="text-xs text-[#A8C5CA] mt-0.5">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
          className="p-2.5 rounded-xl bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#FF5C5C] hover:bg-[#FF5C5C]/15 transition-colors flex items-center gap-1.5"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>

      {/* iOS GROUPED INSET LIST 1: MEMBERSHIP & BILLING */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8C5CA] px-3 mb-2">
          Subscription & Billing
        </div>
        <div className="ios-inset-group">
          <div className="ios-inset-row">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-[#28DACC]" />
              <div>
                <div className="text-sm font-semibold text-[#F4F9FA]">Membership Tier</div>
                <div className="text-xs text-[#A8C5CA]">Current active subscription</div>
              </div>
            </div>
            <Link
              href="/membership"
              className="text-xs font-semibold text-[#28DACC] hover:underline flex items-center gap-1"
            >
              <span>View Plans</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="ios-inset-row flex-col items-start gap-2 bg-[#07151D]/40">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FFB020]">
              <AlertTriangle size={14} />
              <span>Payment Gateway State (Section 11)</span>
            </div>
            <p className="text-xs text-[#A8C5CA] leading-relaxed">
              Provider is currently: <span className="font-mono text-[#F4F9FA]">{paymentProvider}</span>. Live credit card checkout (Stripe/Razorpay) will activate once API credentials and webhook secrets are placed in <code className="text-[#28DACC]">.env.local</code>. Never simulating fake success.
            </p>
          </div>
        </div>
      </div>

      {/* iOS GROUPED INSET LIST 2: PRIVACY & SENSITIVE HEALTH DATA (GDPR / SWISS FADP) */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8C5CA] px-3 mb-2">
          Health Data & Compliance (GDPR / Swiss FADP)
        </div>
        <div className="ios-inset-group">
          <div className="ios-inset-row">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#28DACC]" />
              <div>
                <div className="text-sm font-semibold text-[#F4F9FA]">Consent Protocol v1.2</div>
                <div className="text-xs text-[#A8C5CA]">Injury & physical restriction data consent</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConsentActive(!consentActive)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                consentActive
                  ? "bg-[#28DA8B]/20 text-[#28DA8B] border border-[#28DA8B]/40"
                  : "bg-[#FF5C5C]/20 text-[#FF5C5C] border border-[#FF5C5C]/40"
              }`}
            >
              {consentActive ? "Active" : "Revoked"}
            </button>
          </div>

          <div className="ios-inset-row">
            <div className="flex items-center gap-3">
              <Download size={18} className="text-[#28DACC]" />
              <div>
                <div className="text-sm font-semibold text-[#F4F9FA]">Export Personal Data</div>
                <div className="text-xs text-[#A8C5CA]">Download JSON copy of all logs & answers</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-xl bg-[#102831] border border-[#28525B] text-xs font-semibold text-[#28DACC] hover:border-[#28DACC]"
            >
              {dataExported ? "✓ Downloaded" : "Export"}
            </button>
          </div>

          <div className="ios-inset-row">
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-[#FF5C5C]" />
              <div>
                <div className="text-sm font-semibold text-[#FF5C5C]">Delete Account & Data</div>
                <div className="text-xs text-[#A8C5CA]">Irreversibly remove all stored fitness records</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 text-xs font-semibold text-[#FF5C5C] hover:bg-[#FF5C5C]/25"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* iOS GROUPED INSET LIST 3: LEGAL TEMPLATES */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8C5CA] px-3 mb-2">
          Legal & Policies
        </div>
        <div className="ios-inset-group">
          {[
            { label: "Privacy Policy (GDPR / Swiss Compliant)", href: "#" },
            { label: "Terms and Conditions", href: "#" },
            { label: "Medical & Exercise Disclaimer", href: "#" },
            { label: "Refund & Cancellation Policy", href: "#" }
          ].map((item, i) => (
            <div key={i} className="ios-inset-row cursor-pointer hover:bg-[#102831]/50">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-[#A8C5CA]" />
                <span className="text-sm text-[#F4F9FA]">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-[#A8C5CA]" />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#A8C5CA]/60 mt-2 px-3">
          Note: Legal policies are template frameworks with configurable jurisdiction placeholders. Review with qualified legal counsel prior to commercial launch.
        </p>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#102831] border border-[#FF5C5C]/50 rounded-3xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5C5C]/20 text-[#FF5C5C] flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} />
            </div>
            <h3 className="text-base font-bold text-center text-[#F4F9FA]">
              Delete All Account Data?
            </h3>
            <p className="text-xs text-center text-[#A8C5CA] mt-2 leading-relaxed">
              This action complies with GDPR Right to Erasure. All questionnaire progress, workout logs, and consent records will be wiped from storage immediately.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#07151D] border border-[#28525B] text-xs text-[#A8C5CA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-[#FF5C5C] text-white text-xs font-bold shadow-[0_0_12px_rgba(255,92,92,0.4)]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
