"use client";

import React, { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07151D] text-[#F4F9FA] flex flex-col lg:flex-row">
      <Suspense fallback={<div className="w-64 bg-[#102831]" />}>
        <AdminSidebar />
      </Suspense>

      <div className="flex-1 min-h-screen overflow-y-auto p-4 md:p-8">
        <Suspense fallback={<div className="p-8 text-xs text-[#A8C5CA]">Loading Admin Console...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
