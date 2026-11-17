import React from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
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
          <div className="w-10 h-10 rounded-2xl bg-[#FFB020]/20 text-[#FFB020] flex items-center justify-center mb-4">
            <AlertTriangle size={20} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F4F9FA]">
            Medical &amp; Exercise Disclaimer
          </h1>

          <div className="mt-6 space-y-5 text-xs text-[#A8C5CA] leading-relaxed">
            <div className="p-4 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/40 text-xs text-[#F4F9FA] leading-relaxed font-medium">
              FIT Planner provides educational and personalized physical training guidance. It is not medical advice, diagnosis, or clinical treatment.
            </div>

            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                Consult a Physician Before Starting
              </h2>
              <p>
                Engaging in physical training carries inherent risks of injury. You should consult a medical doctor or licensed physical therapist before beginning any new exercise routine, especially if you have a history of cardiovascular disease, musculoskeletal pain, hypertension, or metabolic disorders.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#F4F9FA] mb-1">
                Restricted Mode Notice
              </h2>
              <p>
                While FIT Planner automatically filters exercises when you report joint pain or injury history (Restricted Mode), software rules cannot replace clinical in-person assessment. If you experience acute pain or dizziness during any movement, cease exercise immediately.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
