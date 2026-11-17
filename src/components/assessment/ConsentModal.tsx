"use client";

import React, { useState } from "react";
import { Shield, Check, AlertCircle } from "lucide-react";

interface ConsentModalProps {
  isOpen: boolean;
  onConsent: () => void;
  onCancel: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onConsent,
  onCancel
}) => {
  const [agreedMedical, setAgreedMedical] = useState(false);
  const [agreedDataProcessing, setAgreedDataProcessing] = useState(false);

  if (!isOpen) return null;

  const canProceed = agreedMedical && agreedDataProcessing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#102831] border border-[#28525B] rounded-3xl p-6 shadow-2xl relative">
        <div className="w-12 h-12 rounded-2xl bg-[#142D35] border border-[#28DACC]/30 flex items-center justify-center text-[#28DACC] mb-4">
          <Shield size={24} />
        </div>

        <h3 className="text-xl font-bold text-[#F4F9FA]">
          Health Data & Medical Consent
        </h3>
        <p className="text-sm text-[#A8C5CA] mt-2 leading-relaxed">
          In order to adapt your workout program to any previous injuries, physical restrictions, or dietary needs, FIT Planner processes sensitive health data under GDPR & Swiss FADP standards.
        </p>

        <div className="mt-5 space-y-3.5">
          {/* Checkbox 1: Medical disclaimer */}
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#142D35] border border-[#28525B] cursor-pointer hover:border-[#28DACC]/40 transition-colors">
            <input
              type="checkbox"
              checked={agreedMedical}
              onChange={(e) => setAgreedMedical(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors mt-0.5 ${
                agreedMedical
                  ? "bg-[#28DACC] border-[#28DACC] text-[#07151D]"
                  : "border-[#28525B] bg-[#07151D]"
              }`}
            >
              {agreedMedical && <Check size={14} className="stroke-[3]" />}
            </div>
            <div className="text-xs text-[#F4F9FA] leading-snug">
              <span className="font-semibold text-white">Medical Disclaimer:</span> I understand FIT Planner provides personalized fitness guidance and is <span className="text-[#FFB020]">not medical advice</span>. I will consult a doctor prior to beginning any new exercise routine.
            </div>
          </label>

          {/* Checkbox 2: Sensitive Data Processing Consent */}
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#142D35] border border-[#28525B] cursor-pointer hover:border-[#28DACC]/40 transition-colors">
            <input
              type="checkbox"
              checked={agreedDataProcessing}
              onChange={(e) => setAgreedDataProcessing(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors mt-0.5 ${
                agreedDataProcessing
                  ? "bg-[#28DACC] border-[#28DACC] text-[#07151D]"
                  : "border-[#28525B] bg-[#07151D]"
              }`}
            >
              {agreedDataProcessing && <Check size={14} className="stroke-[3]" />}
            </div>
            <div className="text-xs text-[#F4F9FA] leading-snug">
              <span className="font-semibold text-white">Sensitive Health Data Consent (v1.2):</span> I explicitly consent to the encrypted storage of my injury and restriction history solely to calibrate safe workout recommendations. I can withdraw this at any time in Profile settings.
            </div>
          </label>
        </div>

        {/* Legal & version note */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#A8C5CA]">
          <AlertCircle size={13} className="text-[#28DACC]" />
          <span>Recorded under Consent Protocol v1.2 with client timestamp.</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-[#07151D] border border-[#28525B] text-sm text-[#A8C5CA] font-medium hover:text-[#F4F9FA] transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={onConsent}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
              canProceed
                ? "bg-[#28DACC] text-[#07151D] shadow-[0_0_20px_rgba(40,218,204,0.3)] active:scale-[0.98]"
                : "bg-[#28525B]/40 text-[#A8C5CA]/40 cursor-not-allowed"
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
