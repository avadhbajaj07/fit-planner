"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Dumbbell,
  Sliders,
  CreditCard,
  Settings,
  ArrowLeft,
  ShieldAlert
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: "Overview & Analytics", href: "/admin", icon: LayoutDashboard },
    { name: "Customers & Athletes", href: "/admin/customers", icon: Users },
    { name: "Questionnaire Builder", href: "/admin/questionnaire", icon: HelpCircle },
    { name: "Exercise Library", href: "/admin/exercises", icon: Dumbbell },
    { name: "Rules & Program Review", href: "/admin/rules", icon: Sliders },
    { name: "Subscriptions & Pricing", href: "/admin/subscriptions", icon: CreditCard },
    { name: "Platform Settings", href: "/admin/settings", icon: Settings }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#102831] border-r border-[#28525B]/70 p-4 lg:p-6 shrink-0 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-[#28525B]/50 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#142D35] border border-[#28DACC]/40 flex items-center justify-center text-[#28DACC] font-bold">
              FP
            </div>
            <div>
              <div className="text-sm font-bold text-[#F4F9FA]">Admin Console</div>
              <div className="text-[10px] font-mono text-[#28DACC] uppercase">
                Coach &amp; Operations
              </div>
            </div>
          </div>

          <Link
            href="/app/today"
            className="text-[11px] text-[#A8C5CA] hover:text-[#28DACC] flex items-center gap-1 font-mono"
            title="Return to Member App"
          >
            <ArrowLeft size={13} />
            <span>App</span>
          </Link>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#142D35] text-[#28DACC] border border-[#28DACC]/30 shadow-[0_0_12px_rgba(40,218,204,0.15)]"
                    : "text-[#A8C5CA] hover:text-[#F4F9FA] hover:bg-[#142D35]/50"
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-[#28525B]/40">
        <div className="p-3 rounded-xl bg-[#07151D] border border-[#28525B]/50 flex items-center gap-2 text-xs text-[#28DA8B]">
          <span className="w-2 h-2 rounded-full bg-[#28DA8B] animate-pulse" />
          <span>Role: Master Admin</span>
        </div>
      </div>
    </aside>
  );
};
