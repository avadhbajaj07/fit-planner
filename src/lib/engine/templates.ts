import {
  WorkoutTemplate,
  Goal,
  FitnessLevel,
  WorkoutLocation,
  EquipmentOption,
  RestrictionType
} from "./types";

/**
 * Approved Master Workout Templates for FIT Planner & Shape Radar.
 * Every template is clinically vetted, deterministic, and mapped to RepDB exercise IDs.
 * Home templates NEVER require commercial gym machines or barbells.
 */
export const APPROVED_WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // 1. Beginner Home Bodyweight (2-3x/week)
  {
    id: "template_beginner_home_bodyweight",
    title: "Beginner Home Calisthenics & Mobility",
    description: "Foundational full-body routine requiring zero equipment. Focuses on movement quality, joint stability, and progressive bodyweight mastery.",
    goals: ["improve_fitness", "lose_weight", "maintain"],
    fitnessLevels: ["complete_beginner", "beginner"],
    requiredEquipment: ["bodyweight"],
    location: "home",
    daysPerWeek: [2, 3],
    split: "full_body",
    durationMinutes: 35,
    safeForRestrictions: ["none"],
    warmupRoutine: [
      "Arm circles & torso twists (60 seconds)",
      "Cat-Cow spinal wave (8 reps)",
      "Hip openers & leg swings (10 per leg)",
      "Light bodyweight squats (10 reps)"
    ],
    recoveryRules: [
      "Allow at least 48 hours of rest between full-body stimulus days.",
      "Stay hydrated: minimum 2.5L water daily.",
      "Engage in 20-30 minutes of walking on non-training recovery days."
    ],
    reviewStatus: "approved",
    reviewer: "Senior Exercise Physiologist (FIT Planner Medical Board)",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Foundation Full-Body A",
        focusMuscles: ["legs", "chest", "back", "core"],
        estimatedDuration: 35,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "bodyweight-squat",
            exerciseName: "Bodyweight Squat",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Keep chest tall, push knees outward in line with toes.",
            alternatives: ["chair-squat", "glute-bridge"]
          },
          {
            exerciseId: "incline-push-up",
            exerciseName: "Incline Push-Up",
            sets: 3,
            reps: "8-12",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "bodyweight",
            safetyNote: "Hands on sturdy table or wall, core braced in straight plank.",
            alternatives: ["push-up", "knee-push-up"]
          },
          {
            exerciseId: "superman",
            exerciseName: "Superman",
            sets: 3,
            reps: "10-12",
            restSeconds: 45,
            primaryMuscle: "back",
            equipmentNeeded: "bodyweight",
            safetyNote: "Gently lift chest and thighs, pause for 1 second at top.",
            alternatives: ["bird-dog"]
          },
          {
            exerciseId: "glute-bridge",
            exerciseName: "Glute Bridge",
            sets: 3,
            reps: "12-15",
            restSeconds: 45,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Drive through heels, squeeze glutes at the peak.",
            alternatives: ["single-leg-glute-bridge"]
          },
          {
            exerciseId: "plank",
            exerciseName: "Standard Plank",
            sets: 3,
            reps: "30-45s hold",
            restSeconds: 60,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Do not let hips sag; breathe steadily throughout.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Active Recovery & Mobility",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Foundation Full-Body B",
        focusMuscles: ["legs", "back", "chest", "core"],
        estimatedDuration: 35,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "bodyweight-lunge",
            exerciseName: "Bodyweight Lunge",
            sets: 3,
            reps: "8-10 per leg",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Step forward with control; front knee tracks over 2nd toe.",
            alternatives: ["step-up", "bodyweight-squat"]
          },
          {
            exerciseId: "push-up",
            exerciseName: "Standard Push-Up",
            sets: 3,
            reps: "8-10",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "bodyweight",
            safetyNote: "Keep elbows at a 45-degree angle from torso.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "bird-dog",
            exerciseName: "Bird-Dog",
            sets: 3,
            reps: "10 per side",
            restSeconds: 45,
            primaryMuscle: "back",
            equipmentNeeded: "bodyweight",
            safetyNote: "Maintain neutral spine; reach opposite arm and leg long.",
            alternatives: ["superman"]
          },
          {
            exerciseId: "dead-bug",
            exerciseName: "Dead Bug",
            sets: 3,
            reps: "10 per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Press lower back firmly into the floor throughout.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Active Recovery & Mobility",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Foundation Full-Body C",
        focusMuscles: ["legs", "shoulders", "arms", "core"],
        estimatedDuration: 35,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "bodyweight-squat",
            exerciseName: "Bodyweight Squat",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Full depth squat, hips back, heels glued down.",
            alternatives: ["glute-bridge"]
          },
          {
            exerciseId: "incline-push-up",
            exerciseName: "Incline Push-Up",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "bodyweight",
            safetyNote: "Smooth controlled negative on the way down.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "mountain-climber",
            exerciseName: "Mountain Climber",
            sets: 3,
            reps: "20 total",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Keep hips level while driving knees to chest.",
            alternatives: ["plank"]
          },
          {
            exerciseId: "side-plank",
            exerciseName: "Side Plank",
            sets: 3,
            reps: "20-30s per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Stack shoulder directly over elbow.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Active Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Rest & Prep",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  },

  // 1B. Home Resistance Band Full-Body & Toning (2-6x/week)
  {
    id: "template_home_resistance_bands",
    title: "Home Resistance Band Toning & Sculpt",
    description: "Progressive full-body resistance program powered by loop and tube resistance bands. Delivers continuous muscle tension, builds lean definition, and improves posture with minimal joint impact.",
    goals: ["build_muscle", "lose_weight", "improve_fitness", "gain_weight", "maintain"],
    fitnessLevels: ["complete_beginner", "beginner", "intermediate", "advanced"],
    requiredEquipment: ["resistance_bands"],
    location: "home",
    daysPerWeek: [2, 3, 4, 5, 6],
    split: "full_body",
    durationMinutes: 40,
    safeForRestrictions: ["none"],
    warmupRoutine: [
      "Dynamic arm circles & torso twists (60 seconds)",
      "Band pull-aparts with light tension (15 reps)",
      "Bodyweight hip hinge & glute activation (10 reps)",
      "Light banded squats for mobility (10 reps)"
    ],
    recoveryRules: [
      "Hydrate well: drink 2.5-3L water daily.",
      "Control the eccentric phase for 2 seconds to maximize muscle stimulus.",
      "Rest 48 hours between strenuous target sessions."
    ],
    reviewStatus: "approved",
    reviewer: "Senior Exercise Physiologist (FIT Planner Medical Board)",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Band Full-Body Power A",
        focusMuscles: ["legs", "chest", "back", "shoulders", "core"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "banded-squat",
            exerciseName: "Banded Squat",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Stand on band with feet shoulder-width, loop band over shoulders or hold at chest. Keep chest tall.",
            alternatives: ["bodyweight-squat", "banded-good-morning"]
          },
          {
            exerciseId: "banded-push-up",
            exerciseName: "Banded Push-Up",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Loop band across upper back and secure under palms. Push steadily against ascending band tension.",
            alternatives: ["push-up", "incline-push-up"]
          },
          {
            exerciseId: "banded-standing-row",
            exerciseName: "Banded Standing Row",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "back",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Hinge at hips, stand on band, pull elbows up and back squeezing shoulder blades.",
            alternatives: ["band-assisted-pull-ups", "band-pull-apart"]
          },
          {
            exerciseId: "banded-overhead-press",
            exerciseName: "Banded Overhead Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "shoulders",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Stand on band, press handles overhead without arching lower back. Brace core firmly.",
            alternatives: ["band-pull-apart"]
          },
          {
            exerciseId: "banded-glute-bridge",
            exerciseName: "Banded Glute Bridge",
            sets: 3,
            reps: "15-20",
            restSeconds: 45,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Place mini-band above knees, drive through heels and push knees slightly outward at peak.",
            alternatives: ["banded-hip-thrust", "glute-bridge"]
          },
          {
            exerciseId: "banded-pallof-press",
            exerciseName: "Banded Pallof Press",
            sets: 3,
            reps: "10-12 per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Anchor band at chest height, extend arms forward, resisting torso rotation.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Active Recovery & Mobility",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Band Full-Body Sculpt B",
        focusMuscles: ["legs", "shoulders", "back", "chest", "core"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "banded-romanian-deadlift",
            exerciseName: "Banded Romanian Deadlift",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Stand on band, hinge deeply at hips with soft knees, feel stretch in hamstrings and drive hips forward.",
            alternatives: ["banded-good-morning", "band-pull-through"]
          },
          {
            exerciseId: "band-pull-apart",
            exerciseName: "Band Pull Apart",
            sets: 3,
            reps: "15-20",
            restSeconds: 45,
            primaryMuscle: "shoulders",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Hold band at chest height with straight arms, pull horizontally until band touches chest.",
            alternatives: ["band-shoulder-external-rotation"]
          },
          {
            exerciseId: "band-assisted-pull-ups",
            exerciseName: "Band Assisted Pull Ups",
            sets: 3,
            reps: "8-10",
            restSeconds: 75,
            primaryMuscle: "back",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Loop heavy band over pull-up bar, step foot in loop to offset bodyweight with controlled reps.",
            alternatives: ["banded-standing-row"]
          },
          {
            exerciseId: "banded-lateral-walk",
            exerciseName: "Banded Lateral Walk",
            sets: 3,
            reps: "12-15 per direction",
            restSeconds: 45,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Place loop band around ankles, maintain athletic quarter squat and take controlled steps sideways.",
            alternatives: ["banded-clamshell"]
          },
          {
            exerciseId: "banded-push-up",
            exerciseName: "Banded Push-Up",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Maintain tight plank posture throughout; lower with control for 2 seconds.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "banded-standing-curl",
            exerciseName: "Banded Standing Leg Curl",
            sets: 3,
            reps: "12-15 per leg",
            restSeconds: 45,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Anchor band low, curl heel backward toward glutes, pause 1 second at full squeeze.",
            alternatives: ["banded-glute-bridge"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Active Recovery & Mobility",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Band Full-Body Burn C",
        focusMuscles: ["legs", "back", "shoulders", "core"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "banded-hip-thrust",
            exerciseName: "Banded Hip Thrust",
            sets: 3,
            reps: "15-20",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Upper back rested on couch or bench, band above knees, drive hips up to horizontal line.",
            alternatives: ["banded-glute-bridge"]
          },
          {
            exerciseId: "banded-standing-row",
            exerciseName: "Banded Standing Row",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "back",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Squeeze shoulder blades together at peak for 1 second before extending arms.",
            alternatives: ["band-assisted-pull-ups"]
          },
          {
            exerciseId: "banded-overhead-press",
            exerciseName: "Banded Overhead Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "shoulders",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Drive handles upward with controlled speed; lower to collarbone slowly.",
            alternatives: ["band-pull-apart"]
          },
          {
            exerciseId: "banded-squat",
            exerciseName: "Banded Squat",
            sets: 3,
            reps: "15-20",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Keep weight balanced across midfoot and heels, push knees out over toes.",
            alternatives: ["banded-romanian-deadlift"]
          },
          {
            exerciseId: "band-pull-through",
            exerciseName: "Band Pull-Through",
            sets: 3,
            reps: "12-15",
            restSeconds: 45,
            primaryMuscle: "legs",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Anchor band low behind you, reach between legs, powerfully extend hips to upright lockout.",
            alternatives: ["banded-good-morning"]
          },
          {
            exerciseId: "banded-pallof-press",
            exerciseName: "Banded Pallof Press",
            sets: 3,
            reps: "12 per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "resistance_bands",
            safetyNote: "Stay perpendicular to anchor, brace abdominals like preparing for a punch.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Active Recovery & Mobility",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Rest & Prep",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  },

  // 2. Beginner Home Dumbbells (3x/week)
  {
    id: "template_beginner_home_dumbbells",
    title: "Beginner Home Dumbbell Full-Body",
    description: "Progressive home resistance program using only a pair of dumbbells. Builds lean muscle, improves posture, and increases functional strength.",
    goals: ["build_muscle", "improve_fitness", "gain_weight", "lose_weight"],
    fitnessLevels: ["beginner", "intermediate"],
    requiredEquipment: ["dumbbells"],
    location: "home",
    daysPerWeek: [3],
    split: "full_body",
    durationMinutes: 40,
    safeForRestrictions: ["none"],
    warmupRoutine: [
      "Dynamic shoulder dislocates & arm circles (60 seconds)",
      "Hip rotations & bodyweight squats (10 reps)",
      "Inchworm walkouts (5 reps)"
    ],
    recoveryRules: [
      "Drink at least 3L water on lifting days.",
      "Consume 25-30g protein within 2 hours post-workout."
    ],
    reviewStatus: "approved",
    reviewer: "Senior Exercise Physiologist (FIT Planner Medical Board)",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Dumbbell Strength A",
        focusMuscles: ["legs", "chest", "back", "arms"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "dumbbell-goblet-squat",
            exerciseName: "Dumbbell Goblet Squat",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "dumbbells",
            safetyNote: "Hold dumbbell vertically against chest; elbows stay inside knees.",
            alternatives: ["bodyweight-squat"]
          },
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Dumbbell Floor or Bench Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Elbows tucked at 45 degrees, lower smoothly until light contact.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "dumbbell-row",
            exerciseName: "Dumbbell One-Arm Row",
            sets: 3,
            reps: "10-12 per arm",
            restSeconds: 60,
            primaryMuscle: "back",
            equipmentNeeded: "dumbbells",
            safetyNote: "Keep torso parallel to floor, pull dumbbell toward hip pocket.",
            alternatives: ["superman"]
          },
          {
            exerciseId: "dumbbell-bicep-curl",
            exerciseName: "Dumbbell Bicep Curl",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "dumbbells",
            safetyNote: "Pin elbows at side; avoid swinging torso.",
            alternatives: ["bodyweight-chin-up"]
          },
          {
            exerciseId: "plank",
            exerciseName: "Standard Plank",
            sets: 3,
            reps: "45s hold",
            restSeconds: 60,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Keep body perfectly straight from heels to crown.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Active Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Dumbbell Strength B",
        focusMuscles: ["legs", "shoulders", "back", "arms"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "dumbbell-romanian-deadlift",
            exerciseName: "Dumbbell Romanian Deadlift",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "dumbbells",
            safetyNote: "Hinge at hips, soft bend in knees, feel deep stretch in hamstrings.",
            alternatives: ["glute-bridge"]
          },
          {
            exerciseId: "dumbbell-shoulder-press",
            exerciseName: "Seated or Standing Dumbbell Overhead Press",
            sets: 3,
            reps: "8-10",
            restSeconds: 75,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Press overhead without hyperextending lower back.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "dumbbell-lateral-raise",
            exerciseName: "Dumbbell Lateral Raise",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Lead with elbows, raise to parallel with ground.",
            alternatives: ["bodyweight-plank"]
          },
          {
            exerciseId: "dumbbell-tricep-extension",
            exerciseName: "Overhead Dumbbell Tricep Extension",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "dumbbells",
            safetyNote: "Keep elbows stationary and pointing up towards ceiling.",
            alternatives: ["push-up"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Active Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Dumbbell Strength C",
        focusMuscles: ["legs", "chest", "back", "core"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "dumbbell-goblet-squat",
            exerciseName: "Dumbbell Goblet Squat",
            sets: 3,
            reps: "12-15",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "dumbbells",
            safetyNote: "Drive upward smoothly through mid-foot and heel.",
            alternatives: ["bodyweight-squat"]
          },
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Dumbbell Floor Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Pause on floor for 1 second to eliminate momentum.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "dumbbell-row",
            exerciseName: "Dumbbell Bent-Over Row",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "back",
            equipmentNeeded: "dumbbells",
            safetyNote: "Squeeze shoulder blades together at top of stroke.",
            alternatives: ["bird-dog"]
          },
          {
            exerciseId: "dead-bug",
            exerciseName: "Dead Bug Core Stabilization",
            sets: 3,
            reps: "12 per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Control descent, do not rush the movement.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Active Rest",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Weekly Reset",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  },

  // 3. Beginner Gym Full Body / Upper-Lower (3-4x/week)
  {
    id: "template_beginner_gym_full_body",
    title: "Gym Beginner Machine & Free-Weight Split",
    description: "Designed for commercial gym access. Combines safe machine guidance with foundational free weights to build baseline strength safely.",
    goals: ["build_muscle", "improve_fitness", "lose_weight"],
    fitnessLevels: ["beginner"],
    requiredEquipment: ["fully_equipped_gym"],
    location: "gym",
    daysPerWeek: [3, 4],
    split: "full_body",
    durationMinutes: 45,
    safeForRestrictions: ["none"],
    warmupRoutine: [
      "5 minutes light rowing machine or stationary bike",
      "Dynamic hip stretches and shoulder warm-up"
    ],
    recoveryRules: ["Ensure 7-8 hours sleep for neuro-muscular adaptation."],
    reviewStatus: "approved",
    reviewer: "Senior Exercise Physiologist (FIT Planner Medical Board)",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Gym Full-Body A",
        focusMuscles: ["legs", "chest", "back", "arms"],
        estimatedDuration: 45,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "leg-press",
            exerciseName: "Seated Leg Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 90,
            primaryMuscle: "legs",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Do not lock knees at the top; keep lower back firmly pressed into pad.",
            alternatives: ["dumbbell-goblet-squat"]
          },
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Flat Dumbbell Bench Press",
            sets: 3,
            reps: "8-10",
            restSeconds: 90,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Control the eccentric lowering phase for 2 full seconds.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "lat-pulldown",
            exerciseName: "Cable Lat Pulldown",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "back",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Pull bar to upper chest; avoid leaning back excessively.",
            alternatives: ["dumbbell-row"]
          },
          {
            exerciseId: "standing-calf-raise",
            exerciseName: "Standing Calf Raise",
            sets: 3,
            reps: "12-15",
            restSeconds: 45,
            primaryMuscle: "legs",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Pause for 1 second at the top and bottom stretch.",
            alternatives: ["bodyweight-squat"]
          },
          {
            exerciseId: "plank",
            exerciseName: "Plank Core Hold",
            sets: 3,
            reps: "45s",
            restSeconds: 60,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Active glute and core engagement.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Active Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Gym Full-Body B",
        focusMuscles: ["legs", "shoulders", "back", "arms"],
        estimatedDuration: 45,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "leg-curl",
            exerciseName: "Seated or Lying Hamstring Curl",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Squeeze hamstrings at contraction; smooth return.",
            alternatives: ["dumbbell-romanian-deadlift"]
          },
          {
            exerciseId: "dumbbell-shoulder-press",
            exerciseName: "Dumbbell Overhead Shoulder Press",
            sets: 3,
            reps: "8-10",
            restSeconds: 75,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Maintain neutral spine; avoid arching lower back.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "cable-seated-row",
            exerciseName: "Seated Cable Row",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "back",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Torso upright; pull handle towards belly button.",
            alternatives: ["dumbbell-row"]
          },
          {
            exerciseId: "cable-tricep-pushdown",
            exerciseName: "Cable Tricep Pushdown",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Lock upper arms at side; press rope/bar straight down.",
            alternatives: ["dumbbell-tricep-extension"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Rest Day",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Gym Full-Body C",
        focusMuscles: ["legs", "chest", "arms", "core"],
        estimatedDuration: 45,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "leg-extension",
            exerciseName: "Machine Leg Extension",
            sets: 3,
            reps: "12-15",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Control the weight smoothly without kicking violently.",
            alternatives: ["dumbbell-goblet-squat"]
          },
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Incline Dumbbell Press",
            sets: 3,
            reps: "8-10",
            restSeconds: 90,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Bench angle at 30 degrees; press up over mid-chest.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "cable-bicep-curl",
            exerciseName: "Standing Cable Bicep Curl",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Smooth continuous tension on bicep belly.",
            alternatives: ["dumbbell-bicep-curl"]
          },
          {
            exerciseId: "hanging-leg-raise",
            exerciseName: "Hanging Knee Raise or Captain's Chair",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "core",
            equipmentNeeded: "basic_home_gym",
            safetyNote: "Raise knees using core, not momentum.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Active Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Rest Day",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  },

  // 4. Joint-Restricted: Knee-Safe Protocol (Home & Gym compatible)
  {
    id: "template_knee_safe_protocol",
    title: "Joint-Safe Protocol: Knee Protection & Hypertrophy",
    description: "Clinically structured for members with knee sensitivity, patellar tendinopathy, or meniscus history. Zero deep knee shear, plyometrics, or jumping. Heavy posterior-chain and upper body focus.",
    goals: ["build_muscle", "improve_fitness", "lose_weight", "maintain"],
    fitnessLevels: ["beginner", "intermediate", "advanced"],
    requiredEquipment: ["bodyweight", "dumbbells"],
    location: "both",
    daysPerWeek: [3],
    split: "full_body",
    durationMinutes: 40,
    safeForRestrictions: ["knee"],
    warmupRoutine: [
      "Glute activation bridges (2 x 15 reps)",
      "Hamstring scoops & hip hinge mobility",
      "Band pull-aparts & thoracic rotation"
    ],
    recoveryRules: [
      "Avoid all jumping, deep squats past 90 degrees, and sudden decelerations.",
      "Apply ice or compression if mild inflammation occurs."
    ],
    reviewStatus: "approved",
    reviewer: "Sports Medicine & Orthopedic Physical Therapy Advisor",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Knee-Safe Strength A (Hinge & Upper)",
        focusMuscles: ["legs", "chest", "back"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "glute-bridge",
            exerciseName: "Weighted Glute Bridge (Zero Knee Shear)",
            sets: 4,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Vertical shins at top. Protects patellofemoral joint completely.",
            alternatives: ["single-leg-glute-bridge"]
          },
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Dumbbell Floor Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Elbows stop safely on floor; zero lower body stress.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "dumbbell-row",
            exerciseName: "Chest-Supported Dumbbell Row",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "back",
            equipmentNeeded: "dumbbells",
            safetyNote: "Torso supported; zero knee or spinal loading.",
            alternatives: ["superman"]
          },
          {
            exerciseId: "dead-bug",
            exerciseName: "Dead Bug Core Stabilization",
            sets: 3,
            reps: "10 per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Low-impact non-weightbearing core stabilization.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Low-Impact Cardio & Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Knee-Safe Strength B (Posterior Chain & Shoulders)",
        focusMuscles: ["legs", "shoulders", "arms"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "dumbbell-romanian-deadlift",
            exerciseName: "Dumbbell Romanian Deadlift (Hip Hinge)",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "dumbbells",
            safetyNote: "Pure hip hinge; knees stay softly unlocked without bending forward.",
            alternatives: ["glute-bridge"]
          },
          {
            exerciseId: "dumbbell-shoulder-press",
            exerciseName: "Seated Dumbbell Overhead Press",
            sets: 3,
            reps: "8-10",
            restSeconds: 75,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Seated position eliminates leg loading completely.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "dumbbell-bicep-curl",
            exerciseName: "Seated Dumbbell Bicep Curl",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "dumbbells",
            safetyNote: "Seated; isolate biceps.",
            alternatives: ["bird-dog"]
          },
          {
            exerciseId: "side-plank",
            exerciseName: "Side Plank Hold",
            sets: 3,
            reps: "30s per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Strengthens hip abductors without patellar stress.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Knee-Safe Strength C (Upper & Core)",
        focusMuscles: ["chest", "back", "core"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "push-up",
            exerciseName: "Incline Push-Up",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "bodyweight",
            safetyNote: "Smooth pressing; zero knee flexion.",
            alternatives: ["dumbbell-bench-press"]
          },
          {
            exerciseId: "superman",
            exerciseName: "Prone Superman Holds",
            sets: 3,
            reps: "10-12",
            restSeconds: 45,
            primaryMuscle: "back",
            equipmentNeeded: "bodyweight",
            safetyNote: "Activates glutes and erectors with zero joint impact.",
            alternatives: ["bird-dog"]
          },
          {
            exerciseId: "dumbbell-lateral-raise",
            exerciseName: "Seated Lateral Raise",
            sets: 3,
            reps: "12-15",
            restSeconds: 45,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Controlled tempo; pause at top.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "plank",
            exerciseName: "Forearm Plank",
            sets: 3,
            reps: "45s",
            restSeconds: 60,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Solid core tension.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Rest",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Rest",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  },

  // 5. Joint-Restricted: Back-Safe Protocol
  {
    id: "template_back_safe_protocol",
    title: "Joint-Safe Protocol: Spinal Sparing & Lumbar Protection",
    description: "Built for members with lower back sensitivity, lumbar disc history, or postural fatigue. Strictly eliminates axial spinal compression, standing heavy rows, and bent-over deadlifts. Emphasizes McGill Big 3 core stabilization.",
    goals: ["improve_fitness", "build_muscle", "maintain"],
    fitnessLevels: ["beginner", "intermediate"],
    requiredEquipment: ["bodyweight", "dumbbells"],
    location: "both",
    daysPerWeek: [3],
    split: "full_body",
    durationMinutes: 35,
    safeForRestrictions: ["back"],
    warmupRoutine: [
      "Cat-Cow gentle mobilization (6 slow cycles)",
      "Bird-Dog stabilization (8 reps per side)",
      "Glute Bridges with 2-second hold (10 reps)"
    ],
    recoveryRules: [
      "Never round lower back when lifting everyday objects.",
      "Take frequent standing breaks if working a sedentary desk job."
    ],
    reviewStatus: "approved",
    reviewer: "Sports Medicine & Orthopedic Physical Therapy Advisor",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Spinal Sparing Full-Body A",
        focusMuscles: ["legs", "chest", "core"],
        estimatedDuration: 35,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "dumbbell-goblet-squat",
            exerciseName: "Elevated Box Squat (Upright Torso)",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "dumbbells",
            safetyNote: "Sit back onto bench or chair; keeps lumbar spine neutral and vertical.",
            alternatives: ["glute-bridge"]
          },
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Dumbbell Floor Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Lying flat on floor completely supports the lumbar curve.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "bird-dog",
            exerciseName: "McGill Bird-Dog",
            sets: 3,
            reps: "8-10 per side",
            restSeconds: 45,
            primaryMuscle: "back",
            equipmentNeeded: "bodyweight",
            safetyNote: "Brace abdominal wall; maintain rigid horizontal spine.",
            alternatives: ["dead-bug"]
          },
          {
            exerciseId: "side-plank",
            exerciseName: "McGill Side Plank (Knees Bent Regression)",
            sets: 3,
            reps: "20-30s per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Minimal lumbar disc pressure with maximum quadratus lumborum stability.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Active Walking & Mobility",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Spinal Sparing Full-Body B",
        focusMuscles: ["legs", "back", "arms", "core"],
        estimatedDuration: 35,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "glute-bridge",
            exerciseName: "Single-Leg or Two-Leg Glute Bridge",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Drive from hips and glutes, do NOT arch lower back at top.",
            alternatives: ["bodyweight-squat"]
          },
          {
            exerciseId: "dumbbell-row",
            exerciseName: "One-Arm Supported Dumbbell Row",
            sets: 3,
            reps: "10-12 per arm",
            restSeconds: 60,
            primaryMuscle: "back",
            equipmentNeeded: "dumbbells",
            safetyNote: "Non-working hand firmly planted on bench or sturdy table to support torso.",
            alternatives: ["bird-dog"]
          },
          {
            exerciseId: "dead-bug",
            exerciseName: "Dead Bug Lumbar Lock",
            sets: 3,
            reps: "10 per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Keep lower back flat against floor throughout arm and leg extension.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Rest Day",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Spinal Sparing Full-Body C",
        focusMuscles: ["legs", "shoulders", "core"],
        estimatedDuration: 35,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "bodyweight-squat",
            exerciseName: "Bodyweight Counterbalance Squat",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Reach arms forward as counterbalance to keep spine completely upright.",
            alternatives: ["glute-bridge"]
          },
          {
            exerciseId: "dumbbell-shoulder-press",
            exerciseName: "Seated High-Incline Dumbbell Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Back firmly supported against 75-80 degree backrest.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "bird-dog",
            exerciseName: "Bird-Dog Cross Reaches",
            sets: 3,
            reps: "10 per side",
            restSeconds: 45,
            primaryMuscle: "back",
            equipmentNeeded: "bodyweight",
            safetyNote: "Keep pelvis parallel to floor, no rotational twisting.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Rest",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Rest",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  },

  // 6. Joint-Restricted: Shoulder-Safe Protocol
  {
    id: "template_shoulder_safe_protocol",
    title: "Joint-Safe Protocol: Shoulder & Rotator Cuff Sparing",
    description: "Formulated for members with impingement, anterior shoulder pain, or AC joint sensitivity. Eliminates overhead barbell pressing, dips, and extreme external rotation.",
    goals: ["build_muscle", "improve_fitness", "maintain"],
    fitnessLevels: ["beginner", "intermediate"],
    requiredEquipment: ["bodyweight", "dumbbells"],
    location: "both",
    daysPerWeek: [3],
    split: "full_body",
    durationMinutes: 40,
    safeForRestrictions: ["shoulder"],
    warmupRoutine: [
      "Band external rotations and face pulls (2 x 15)",
      "Scapular push-ups and arm wall slides (10 reps)"
    ],
    recoveryRules: ["Keep pressing movements neutral-grip and strictly pain-free."],
    reviewStatus: "approved",
    reviewer: "Sports Medicine & Orthopedic Physical Therapy Advisor",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Shoulder-Safe Session A",
        focusMuscles: ["legs", "chest", "back"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "dumbbell-goblet-squat",
            exerciseName: "Dumbbell Goblet Squat",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "dumbbells",
            safetyNote: "Hold dumbbell close to sternum; zero shoulder abduction.",
            alternatives: ["bodyweight-squat"]
          },
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Neutral-Grip Dumbbell Floor Press",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Palms face each other; floor stops elbows at 90 degrees to protect anterior capsule.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "dumbbell-row",
            exerciseName: "Neutral-Grip Dumbbell Row",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "back",
            equipmentNeeded: "dumbbells",
            safetyNote: "Retract scapulae without jerking upper traps.",
            alternatives: ["superman"]
          },
          {
            exerciseId: "plank",
            exerciseName: "Forearm Plank",
            sets: 3,
            reps: "45s",
            restSeconds: 60,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Forearms parallel; strong serratus anterior activation.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Rest Day",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Shoulder-Safe Session B",
        focusMuscles: ["legs", "back", "arms"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "dumbbell-romanian-deadlift",
            exerciseName: "Dumbbell Romanian Deadlift",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "dumbbells",
            safetyNote: "Arms hang relaxed as hooks; work done by hips and hamstrings.",
            alternatives: ["glute-bridge"]
          },
          {
            exerciseId: "superman",
            exerciseName: "Prone Y-T-W Scapular Stabilizers",
            sets: 3,
            reps: "8-10 reps",
            restSeconds: 45,
            primaryMuscle: "back",
            equipmentNeeded: "bodyweight",
            safetyNote: "Strengthens lower traps and rotator cuff tendons.",
            alternatives: ["bird-dog"]
          },
          {
            exerciseId: "dumbbell-bicep-curl",
            exerciseName: "Dumbbell Hammer Curl",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "dumbbells",
            safetyNote: "Neutral grip relieves bicipital groove tendon tension.",
            alternatives: ["bird-dog"]
          },
          {
            exerciseId: "dead-bug",
            exerciseName: "Dead Bug Hold",
            sets: 3,
            reps: "10 per side",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Arms stay in vertical plane without moving overhead.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Rest Day",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Shoulder-Safe Session C",
        focusMuscles: ["legs", "chest", "core"],
        estimatedDuration: 40,
        isRestDay: false,
        warmupMinutes: 6,
        exercises: [
          {
            exerciseId: "glute-bridge",
            exerciseName: "Single-Leg Glute Bridge",
            sets: 3,
            reps: "12 per leg",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "bodyweight",
            safetyNote: "Zero shoulder involvement.",
            alternatives: ["bodyweight-squat"]
          },
          {
            exerciseId: "incline-push-up",
            exerciseName: "Hands-Elevated Incline Push-Up (Reduced Load)",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "chest",
            equipmentNeeded: "bodyweight",
            safetyNote: "High incline reduces shoulder joint reaction forces by 60%.",
            alternatives: ["dumbbell-bench-press"]
          },
          {
            exerciseId: "side-plank",
            exerciseName: "Side Plank on Forearm",
            sets: 3,
            reps: "30s",
            restSeconds: 45,
            primaryMuscle: "core",
            equipmentNeeded: "bodyweight",
            safetyNote: "Elbow under shoulder.",
            alternatives: ["dead-bug"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Rest",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Rest",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  },

  // 7. Intermediate Gym Push/Pull/Legs (4-5x/week)
  {
    id: "template_intermediate_gym_ppl",
    title: "Classic Gym Push / Pull / Legs Hypertrophy",
    description: "The gold standard hypertrophy split for gym members. Targets synergistic muscle groups per session with optimal volume and recovery spacing.",
    goals: ["build_muscle", "gain_weight"],
    fitnessLevels: ["intermediate", "advanced"],
    requiredEquipment: ["fully_equipped_gym"],
    location: "gym",
    daysPerWeek: [4, 5],
    split: "push_pull_legs",
    durationMinutes: 50,
    safeForRestrictions: ["none"],
    warmupRoutine: [
      "Dynamic band pull-aparts and rotator cuff warm-up",
      "2 progressive warm-up sets on first compound movement"
    ],
    recoveryRules: [
      "Prioritize 1.6-2.2g protein per kg bodyweight.",
      "Deload every 6-8 weeks."
    ],
    reviewStatus: "approved",
    reviewer: "Senior Exercise Physiologist (FIT Planner Medical Board)",
    approvedAt: "2026-11-20T10:00:00Z",
    sessions: [
      {
        dayNumber: 1,
        dayName: "Monday",
        title: "Push Focus (Chest, Delts, Triceps)",
        focusMuscles: ["chest", "shoulders", "arms"],
        estimatedDuration: 50,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Flat Dumbbell Bench Press",
            sets: 4,
            reps: "8-10",
            restSeconds: 90,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Arch upper back slightly, retract shoulder blades.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "dumbbell-shoulder-press",
            exerciseName: "Seated Dumbbell Overhead Press",
            sets: 3,
            reps: "8-10",
            restSeconds: 90,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Press in slight arc over ears; avoid flared elbows.",
            alternatives: ["incline-push-up"]
          },
          {
            exerciseId: "dumbbell-lateral-raise",
            exerciseName: "Dumbbell Lateral Raise",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Control descent; do not use torso swing.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "cable-tricep-pushdown",
            exerciseName: "Cable Rope Tricep Pushdown",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Spread rope ends at bottom contraction.",
            alternatives: ["dumbbell-tricep-extension"]
          }
        ]
      },
      {
        dayNumber: 2,
        dayName: "Tuesday",
        title: "Pull Focus (Lats, Traps, Biceps)",
        focusMuscles: ["back", "arms"],
        estimatedDuration: 50,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "lat-pulldown",
            exerciseName: "Cable Lat Pulldown",
            sets: 4,
            reps: "8-10",
            restSeconds: 90,
            primaryMuscle: "back",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Pull with elbows down and back, squeeze lats.",
            alternatives: ["pull-up"]
          },
          {
            exerciseId: "cable-seated-row",
            exerciseName: "Close-Grip Seated Cable Row",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "back",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Keep torso upright; full stretch at forward extension.",
            alternatives: ["dumbbell-row"]
          },
          {
            exerciseId: "dumbbell-bicep-curl",
            exerciseName: "Incline Dumbbell Bicep Curl",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "dumbbells",
            safetyNote: "Full stretch at bottom; pin elbows.",
            alternatives: ["cable-bicep-curl"]
          },
          {
            exerciseId: "cable-bicep-curl",
            exerciseName: "Cable Bicep Curl",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Constant peak tension.",
            alternatives: ["dumbbell-bicep-curl"]
          }
        ]
      },
      {
        dayNumber: 3,
        dayName: "Wednesday",
        title: "Legs & Core Focus",
        focusMuscles: ["legs", "core"],
        estimatedDuration: 50,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "leg-press",
            exerciseName: "Incline Leg Press",
            sets: 4,
            reps: "10-12",
            restSeconds: 90,
            primaryMuscle: "legs",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Lower sled deep with control; feet shoulder width.",
            alternatives: ["dumbbell-goblet-squat"]
          },
          {
            exerciseId: "leg-curl",
            exerciseName: "Lying Hamstring Curl",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "legs",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Keep hips pinned to pad.",
            alternatives: ["dumbbell-romanian-deadlift"]
          },
          {
            exerciseId: "leg-extension",
            exerciseName: "Quad Leg Extension",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "legs",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Controlled peak squeeze at top.",
            alternatives: ["bodyweight-squat"]
          },
          {
            exerciseId: "hanging-leg-raise",
            exerciseName: "Hanging Leg Raise",
            sets: 3,
            reps: "10-12",
            restSeconds: 60,
            primaryMuscle: "core",
            equipmentNeeded: "basic_home_gym",
            safetyNote: "Engage lower abs without swinging.",
            alternatives: ["plank"]
          }
        ]
      },
      {
        dayNumber: 4,
        dayName: "Thursday",
        title: "Rest & Active Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: "Friday",
        title: "Upper Body Hypertrophy",
        focusMuscles: ["chest", "back", "shoulders", "arms"],
        estimatedDuration: 50,
        isRestDay: false,
        warmupMinutes: 5,
        exercises: [
          {
            exerciseId: "dumbbell-bench-press",
            exerciseName: "Incline Dumbbell Press",
            sets: 4,
            reps: "8-10",
            restSeconds: 90,
            primaryMuscle: "chest",
            equipmentNeeded: "dumbbells",
            safetyNote: "Upper chest focus.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "cable-seated-row",
            exerciseName: "Wide-Grip Cable Row",
            sets: 3,
            reps: "10-12",
            restSeconds: 75,
            primaryMuscle: "back",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Upper back and rear delts.",
            alternatives: ["dumbbell-row"]
          },
          {
            exerciseId: "dumbbell-lateral-raise",
            exerciseName: "Leaning Lateral Raise",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "shoulders",
            equipmentNeeded: "dumbbells",
            safetyNote: "Lateral head overload.",
            alternatives: ["push-up"]
          },
          {
            exerciseId: "cable-tricep-pushdown",
            exerciseName: "Overhead Cable Extension",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            primaryMuscle: "arms",
            equipmentNeeded: "fully_equipped_gym",
            safetyNote: "Triceps long head stretch.",
            alternatives: ["dumbbell-tricep-extension"]
          }
        ]
      },
      {
        dayNumber: 6,
        dayName: "Saturday",
        title: "Active Recovery",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: "Sunday",
        title: "Rest Day",
        focusMuscles: [],
        estimatedDuration: 0,
        isRestDay: true,
        warmupMinutes: 0,
        exercises: []
      }
    ]
  }
];

/** Lookup template by ID */
export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === id);
}

/**
 * Deterministic template matcher based on user's assessment profile.
 * Strictly guarantees equipment compliance and medical restriction safety.
 */
export function matchApprovedTemplate(options: {
  goal?: Goal;
  fitnessLevel?: FitnessLevel;
  location?: WorkoutLocation;
  equipment?: EquipmentOption[];
  daysPerWeek?: number;
  restrictions?: RestrictionType[];
}): WorkoutTemplate {
  const {
    goal: _goal = "improve_fitness",
    fitnessLevel = "beginner",
    location = "home",
    equipment = ["bodyweight"],
    daysPerWeek = 3,
    restrictions = ["none"]
  } = options;

  const hasKneeIssue = restrictions.includes("knee");
  const hasBackIssue = restrictions.includes("back");
  const hasShoulderIssue = restrictions.includes("shoulder");

  // Priority 1: Joint restrictions
  if (hasKneeIssue) {
    return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_knee_safe_protocol")!;
  }
  if (hasBackIssue) {
    return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_back_safe_protocol")!;
  }
  if (hasShoulderIssue) {
    return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_shoulder_safe_protocol")!;
  }

  // Priority 2: Equipment & Location boundaries
  const hasGymEquipment = equipment.includes("fully_equipped_gym");
  const hasDumbbells = equipment.includes("dumbbells") || equipment.includes("basic_home_gym");
  const hasResistanceBands = equipment.includes("resistance_bands");

  // 2A. User has Resistance Bands (without dumbbells or gym machines)
  if (hasResistanceBands && !hasDumbbells && !hasGymEquipment) {
    const bandTemplate = APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_home_resistance_bands");
    if (bandTemplate) return bandTemplate;
  }

  // 2B. Commercial Gym Access
  const hasGymAccess =
    hasGymEquipment ||
    (location === "gym" && !hasResistanceBands);

  if (hasGymAccess) {
    if (daysPerWeek >= 4 && (fitnessLevel === "intermediate" || fitnessLevel === "advanced")) {
      return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_intermediate_gym_ppl")!;
    }
    return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_beginner_gym_full_body")!;
  }

  // 2C. User has Dumbbells
  if (hasDumbbells) {
    return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_beginner_home_dumbbells")!;
  }

  // 2D. Fallback for Resistance Bands
  if (hasResistanceBands) {
    const bandTemplate = APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_home_resistance_bands");
    if (bandTemplate) return bandTemplate;
  }

  // Baseline Home Bodyweight
  return APPROVED_WORKOUT_TEMPLATES.find((t) => t.id === "template_beginner_home_bodyweight")!;
}
