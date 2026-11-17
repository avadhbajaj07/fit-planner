import React from "react";
import Link from "next/link";
import { ChevronLeft, FileText, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-[#28DACC] font-semibold"
        >
          <ChevronLeft size={16} /> Back to FIT Planner
        </Link>

        <div className="ios-glass-card rounded-3xl p-6 md:p-8 border border-[#28525B]">
          <div className="w-10 h-10 rounded-2xl bg-[#102831] text-[#28DACC] flex items-center justify-center mb-4">
            <FileText size={20} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA]">
            Terms and Conditions
          </h1>
          <p className="text-xs text-[#A8C5CA] mt-1 font-mono">
            Version 1.0 · Last Updated: November 2026
          </p>

          <div className="mt-6 space-y-5 text-xs text-[#A8C5CA] leading-relaxed">
            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                1. Eligibility (18+ Requirement)
              </h2>
              <p>
                FIT Planner is strictly intended for individuals aged eighteen (18) years or older. By registering or using the service, you represent and warrant that you are at least 18 years of age.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                2. Subscription &amp; Cancellation Policy
              </h2>
              <p>
                Memberships renew automatically at the end of each billing cycle (1, 3, or 6 months) unless cancelled prior to the renewal date. You may cancel at any time via your Profile settings or billing portal.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                3. No Outcome Guarantees
              </h2>
              <p>
                Physical fitness and body composition depend on genetics, consistency, recovery, and caloric adherence. FIT Planner provides structured programming and logging tools but makes no express or implied warranty of specific weight loss or muscle gain outcomes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
