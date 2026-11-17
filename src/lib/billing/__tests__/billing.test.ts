import { describe, it, expect } from "vitest";
import { getActiveBillingProvider } from "../provider";
import { formatPrice, DEFAULT_MEMBERSHIP_PLANS } from "../plans";

describe("FIT Planner Billing Provider Abstraction", () => {
  it("returns unconfigured null adapter when provider is none or unconfigured", async () => {
    const provider = getActiveBillingProvider("none");
    expect(provider.name).toBe("none");
    expect(provider.isConfigured()).toBe(false);

    const result = await provider.createCheckoutSession({
      userId: "test_user_1",
      userEmail: "test@fitplanner.app",
      planId: "plan_1_month",
      tierMonths: 1,
      currency: "EUR",
      amount: 29.0,
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel"
    });

    expect(result.status).toBe("setup_required");
    expect(result.errorMessage).toContain("No payment provider is currently configured");
  });

  it("handles Stripe adapter with clean setup_required when keys are not in environment", async () => {
    const provider = getActiveBillingProvider("stripe");
    expect(provider.name).toBe("stripe");

    // Since STRIPE_SECRET_KEY is empty in test environment
    expect(provider.isConfigured()).toBe(false);

    const result = await provider.createCheckoutSession({
      userId: "test_user_stripe",
      userEmail: "stripe_test@fitplanner.app",
      planId: "plan_3_month",
      tierMonths: 3,
      currency: "CHF",
      amount: 69.0,
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel"
    });

    expect(result.status).toBe("setup_required");
    expect(result.errorMessage).toContain("Stripe is not configured");
  });

  it("handles Razorpay adapter with clean setup_required when keys are missing", async () => {
    const provider = getActiveBillingProvider("razorpay");
    expect(provider.name).toBe("razorpay");
    expect(provider.isConfigured()).toBe(false);

    const result = await provider.createCheckoutSession({
      userId: "test_user_razorpay",
      userEmail: "razorpay_test@fitplanner.app",
      planId: "plan_6_month",
      tierMonths: 6,
      currency: "INR",
      amount: 7999.0,
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel"
    });

    expect(result.status).toBe("setup_required");
    expect(result.errorMessage).toContain("Razorpay is not configured");
  });

  it("formats currency prices accurately across CHF, EUR, USD, and INR", () => {
    expect(formatPrice(29.0, "EUR")).toBe("€29.00");
    expect(formatPrice(69.0, "CHF")).toBe("CHF 69.00");
    expect(formatPrice(32.0, "USD")).toBe("$32.00");
    expect(formatPrice(1999.0, "INR")).toBe("₹1,999");
    expect(formatPrice(null, "EUR")).toBe("Pricing not configured");
  });

  it("provides 1-month, 3-month, and 6-month tier configurations", () => {
    expect(DEFAULT_MEMBERSHIP_PLANS.length).toBe(3);
    const months = DEFAULT_MEMBERSHIP_PLANS.map((p) => p.tierMonths);
    expect(months).toEqual([1, 3, 6]);
  });
});
