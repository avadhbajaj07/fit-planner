import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const askSchema = z.object({
  query: z.string().min(1, "Please enter a question or goal.").max(500, "Query is too long.")
});

interface AnswerPayload {
  headline: string;
  answer: string;
  pillars: { title: string; detail: string }[];
  suggestedAction: { label: string; href: string };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = askSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { query } = result.data;
    const lower = query.toLowerCase().trim();

    // Deterministic Sports-Science Knowledge Engine
    let response: AnswerPayload;

    if (lower.includes("bench") || lower.includes("chest") || lower.includes("upper body")) {
      response = {
        headline: "Upper Body Hypertrophy & Pressing Strategy",
        answer:
          "To steadily increase your bench press and pectoral mass, structure your routine around double progression: lock in 3 sets of 6–8 reps at a consistent weight before stepping up by 2.5kg. Pair barbell pressing with dumbbell incline presses to address unilateral weaknesses and optimize shoulder scapular mechanics.",
        pillars: [
          { title: "Target Rep Bracket", detail: "6–8 reps for main compound; 8–12 reps for accessory work." },
          { title: "Rest Interval", detail: "2.5 to 3 minutes between heavy sets to allow full ATP resynthesis." },
          { title: "Deload Trigger", detail: "Reduce volume by 40% every 5th or 6th week if RPE stays above 9." }
        ],
        suggestedAction: { label: "Generate Upper Body Blueprint", href: "/assessment?goal=hypertrophy" }
      };
    } else if (lower.includes("fat loss") || lower.includes("lose weight") || lower.includes("cut") || lower.includes("burn fat")) {
      response = {
        headline: "Evidence-Based Fat Loss & Lean Muscle Preservation",
        answer:
          "Successful fat loss requires a moderate caloric deficit (300–500 kcal/day) while preserving resistance training volume. Keep protein elevated at 1.8–2.2g per kg of bodyweight to prevent lean muscle catabolism. High density compound lifts ensure your metabolic rate remains elevated.",
        pillars: [
          { title: "Calorie Deficit", detail: "Target ~15–20% below your calculated Total Daily Energy Expenditure (TDEDE)." },
          { title: "Protein Priority", detail: "Spread across 3–4 meals at roughly 0.4g/kg per meal." },
          { title: "Cardio Integration", detail: "Prioritize low-impact Zone 2 or steps (8,000–10,000 daily) over excessive HIIT." }
        ],
        suggestedAction: { label: "Calculate Fat Loss Macro Plan", href: "/assessment?goal=fat_loss" }
      };
    } else if (lower.includes("protein") || lower.includes("diet") || lower.includes("food") || lower.includes("nutrition")) {
      response = {
        headline: "Macro Distribution & Nutrient Timing Protocol",
        answer:
          "Optimal recovery and protein synthesis trigger when essential amino acids (specifically 2.5–3g leucine) are consumed every 3 to 5 hours. Carbohydrates should be prioritized around your workout window to replenish muscle glycogen stores and sustain high output.",
        pillars: [
          { title: "Daily Target", detail: "1.6–2.2g of protein per kg of body mass depending on training intensity." },
          { title: "Pre-Workout", detail: "Easily digestible carbohydrates 60–90 minutes before lifting." },
          { title: "Hydration", detail: "Maintain 35–45ml of fluids per kg bodyweight daily." }
        ],
        suggestedAction: { label: "View Nutrition Engine", href: "/assessment" }
      };
    } else if (lower.includes("squat") || lower.includes("deadlift") || lower.includes("legs") || lower.includes("strength")) {
      response = {
        headline: "Compound Strength & Neuromuscular Adaptation",
        answer:
          "Lower body strength progression leverages high neurological drive in the 3–5 rep range at RPE 7.5–8.5. Shape Radar calculates your estimated 1RM using the Epley formula: Weight × (1 + Reps / 30). This automatically shifts your training load week-over-week without sudden injury risks.",
        pillars: [
          { title: "Intensity Range", detail: "75% to 85% of 1RM across working compound sets." },
          { title: "Warmup Protocol", detail: "Dynamic hip activation followed by 3–4 progressive warmup ramps." },
          { title: "Weekly Volume", detail: "10–14 direct sets per muscle group weekly." }
        ],
        suggestedAction: { label: "Build Strength Blueprint", href: "/assessment?goal=strength" }
      };
    } else {
      // General athletic planning response
      response = {
        headline: `Tailored Strategy for "${query.slice(0, 40)}"`,
        answer:
          "Shape Radar's algorithms dynamically construct training cycles based on your available equipment, joint limitations, and preferred split. By enforcing progressive overload and calculated rest intervals, you avoid plateaus and guarantee sustainable athletic development.",
        pillars: [
          { title: "Periodization", detail: "12-week microcycles with automated deloading every 6 weeks." },
          { title: "Exercise Matching", detail: "Substitutions calibrated to home, dumbbell, band, or full gym setups." },
          { title: "Readiness Check", detail: "Real-time RPE scoring adjusts subsequent set weights on the fly." }
        ],
        suggestedAction: { label: "Start 1-Min Assessment", href: "/assessment?mode=express" }
      };
    }

    return NextResponse.json({
      success: true,
      query,
      result: response
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal assistant error. Please try again.", details: err?.message },
      { status: 500 }
    );
  }
}
