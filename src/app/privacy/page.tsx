import React from "react";
import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield size={20} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA]">
            Privacy & Data Protection Policy
          </h1>
          <p className="text-xs text-[#A8C5CA] mt-1 font-mono">
            Compliance Framework: GDPR (EU) / Swiss FADP (nDSG) · Protocol v1.2
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/40 text-xs text-[#F4F9FA] leading-relaxed">
            <span className="font-bold text-[#FFB020]">Legal Notice:</span> This template contains configurable entity placeholders (&quot;[Company Entity Name]&quot;, &quot;[Jurisdiction]&quot;). Review with qualified legal counsel before production launch.
          </div>

          <div className="mt-6 space-y-5 text-xs text-[#A8C5CA] leading-relaxed">
            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                1. Sensitive Health Data Processing
              </h2>
              <p>
                Under Article 9 of GDPR and Article 5 of the Swiss FADP, physical injury reports, joint restrictions, and dietary allergen records are classified as sensitive health data. FIT Planner processes this data exclusively pursuant to your explicit, separate affirmative consent recorded during questionnaire completion.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                2. Data Minimisation
              </h2>
              <p>
                We collect only parameters necessary for deterministic workout and nutrition calibration: goal, experience, available equipment, schedule, joint restrictions, and self-reported body metrics. No third-party tracking pixels or behavioral ad networks access your health logs.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                3. Your Rights (Access, Export, and Erasure)
              </h2>
              <p>
                You retain self-service control over your data directly within your member Profile tab. You may export a complete JSON archive of your assessment and workout logs at any time or execute irreversible deletion under the Right to Erasure (GDPR Art. 17).
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                4. Consent Withdrawal
              </h2>
              <p>
                You may revoke health data consent at any time in Profile &gt; Health Data &amp; Compliance. Upon revocation, physical restriction filters are cleared and workout programming reverts to baseline.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
