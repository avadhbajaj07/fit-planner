import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendTransactionalEmail } from "@/lib/email/resendClient";
import { getWelcomePlanEmailHtml } from "@/lib/email/templates";
import { getAuthenticatedSupabaseUser } from "@/lib/billing/sandboxSecurity";

const SendPlanSchema = z.object({
  athleteName: z.string().optional(),
  goal: z.string(),
  split: z.string(),
  daysPerWeek: z.number().min(1).max(7),
  dailyCalories: z.number().optional(),
  proteinGrams: z.number().optional()
});

export async function POST(req: NextRequest) {
  try {
    // Require authenticated Supabase user — never allow arbitrary third-party email relay
    const user = await getAuthenticatedSupabaseUser(req);
    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Authentication required to dispatch plan email." },
        { status: 401 }
      );
    }

    const json = await req.json();
    const parsed = SendPlanSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email parameters.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { athleteName, goal, split, daysPerWeek, dailyCalories, proteinGrams } = parsed.data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

    const html = getWelcomePlanEmailHtml({
      athleteName,
      goal,
      split,
      daysPerWeek,
      dailyCalories,
      proteinGrams,
      dashboardUrl: `${appUrl}/app/today`
    });

    const result = await sendTransactionalEmail({
      to: user.email,
      subject: `Your Personalized Shape Radar Periodization Plan (${goal.replace(/_/g, " ").toUpperCase()})`,
      html
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to dispatch plan email.", message: err.message },
      { status: 500 }
    );
  }
}
