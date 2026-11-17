import { MembershipPlan, CurrencyCode } from "./types";

export const DEFAULT_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "plan_1_month",
    tierMonths: 1,
    name: "1-Month Plan",
    badge: "Monthly Starter",
    description: "Full access to dynamic workout programs, Focus Mode, and weekly progression logs.",
    prices: {
      CHF: 29.0,
      EUR: 29.0,
      USD: 32.0,
      INR: 1999.0
    },
    featured: false
  },
  {
    id: "plan_3_month",
    tierMonths: 3,
    name: "3-Month Plan",
    badge: "Most Popular",
    description: "12-week comprehensive athletic cycle. Double progression, recovery tracking, and upcoming nutrition modules.",
    prices: {
      CHF: 69.0,
      EUR: 69.0,
      USD: 79.0,
      INR: 4999.0
    },
    featured: true
  },
  {
    id: "plan_6_month",
    tierMonths: 6,
    name: "6-Month Plan",
    badge: "Best Value",
    description: "Complete habit transformation with periodized split updates and continuous injury-aware regressions.",
    prices: {
      CHF: 119.0,
      EUR: 119.0,
      USD: 129.0,
      INR: 7999.0
    },
    featured: false
  }
];

export function formatPrice(amount: number | null, currency: CurrencyCode): string {
  if (amount === null || isNaN(amount)) {
    return "Pricing not configured";
  }

  const symbols: Record<CurrencyCode, string> = {
    CHF: "CHF ",
    EUR: "€",
    USD: "$",
    INR: "₹"
  };

  const symbol = symbols[currency] || "";
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: currency === "INR" ? 0 : 2,
    maximumFractionDigits: 2
  });

  return `${symbol}${formatted}`;
}
