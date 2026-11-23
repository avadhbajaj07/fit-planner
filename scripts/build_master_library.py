#!/usr/bin/env python3
"""
Master Exercise Library Import & Normalization Script for FIT Planner / Shape Radar.
Processes ~/Downloads/exercise-dataset/exercises.json and links 1,231 WebP illustrations.
Exports:
  1. src/lib/data/repdb_exercises.json (complete 708 records)
  2. src/lib/data/exerciseLibrary.ts (master TypeScript module with lookup helpers)
"""

import json
import os
import re

DATASET_PATH = "/Users/shikha/Downloads/exercise-dataset/exercises.json"
WORKSPACE_DIR = "/Users/shikha/.gemini/antigravity/scratch/fit-planner"
PUBLIC_IMAGES_DIR = os.path.join(WORKSPACE_DIR, "public/images/flat")
OUTPUT_JSON_PATH = os.path.join(WORKSPACE_DIR, "src/lib/data/repdb_exercises.json")
OUTPUT_TS_PATH = os.path.join(WORKSPACE_DIR, "src/lib/data/exerciseLibrary.ts")

MUSCLE_MAP = {
    # Chest
    "pectoralis_major": "chest",
    "serratus_anterior": "chest",
    # Back
    "latissimus_dorsi": "back",
    "rhomboids": "back",
    "trapezius": "back",
    "erector_spinae": "back",
    "infraspinatus_teres_minor": "back",
    "supraspinatus": "back",
    # Shoulders
    "anterior_deltoid": "shoulders",
    "lateral_deltoid": "shoulders",
    "posterior_deltoid": "shoulders",
    # Arms
    "biceps_brachii": "arms",
    "brachialis": "arms",
    "brachioradialis": "arms",
    "triceps_brachii": "arms",
    "forearms": "arms",
    "forearm_extensors": "arms",
    "forearm_flexors": "arms",
    # Legs
    "quadriceps": "legs",
    "hamstrings": "legs",
    "gluteus_maximus": "legs",
    "gluteus_medius": "legs",
    "gastrocnemius": "legs",
    "soleus": "legs",
    "abductors": "legs",
    "adductors": "legs",
    "hip_flexors": "legs",
    "tibialis_anterior": "legs",
    # Core
    "rectus_abdominis": "core",
    "obliques": "core",
    "transverse_abdominis": "core",
    "quadratus_lumborum": "core",
}

# Equipment categorizations
EQUIPMENT_DIRECT = {
    None: ["bodyweight"],
    "": ["bodyweight"],
    "bodyweight": ["bodyweight"],
    "dumbbell": ["dumbbells", "basic_home_gym", "fully_equipped_gym"],
    "resistance_band": ["resistance_bands", "basic_home_gym", "fully_equipped_gym"],
    "loop_band": ["resistance_bands", "basic_home_gym", "fully_equipped_gym"],
    "pull_up_bar": ["basic_home_gym", "fully_equipped_gym"],
    "kettlebell": ["basic_home_gym", "fully_equipped_gym"],
    "ab_wheel": ["basic_home_gym", "fully_equipped_gym"],
    "stability_ball": ["basic_home_gym", "fully_equipped_gym"],
    "suspension_trainer": ["basic_home_gym", "fully_equipped_gym"],
    "flat_bench": ["basic_home_gym", "fully_equipped_gym"],
    "rings": ["basic_home_gym", "fully_equipped_gym"],
    "plyo_box": ["basic_home_gym", "fully_equipped_gym"],
    "dip_station": ["basic_home_gym", "fully_equipped_gym"],
}

# Core approved foundation exercises for template matching
APPROVED_CORE_IDS = {
    "push-up", "incline-push-up", "dumbbell-bench-press", "dumbbell-shoulder-press",
    "dumbbell-lateral-raise", "dumbbell-row", "dumbbell-bicep-curl", "dumbbell-tricep-extension",
    "bodyweight-squat", "dumbbell-goblet-squat", "dumbbell-romanian-deadlift", "bodyweight-lunge",
    "glute-bridge", "plank", "crunch", "mountain-climber", "pull-up", "chin-up",
    "barbell-bench-press", "barbell-squat", "barbell-deadlift", "overhead-press",
    "lat-pulldown", "cable-seated-row", "leg-press", "leg-curl", "leg-extension",
    "cable-tricep-pushdown", "cable-bicep-curl", "standing-calf-raise", "seated-calf-raise",
    "superman", "bird-dog", "side-plank", "dead-bug", "hanging-leg-raise"
}

def detect_contraindications(ex):
    contras = []
    text = (ex.get("name_en", "") + " " + " ".join(ex.get("tags", [])) + " " + (ex.get("equipment") or "")).lower()
    
    # Knee contraindication: deep jumps, heavy knee extension, lunges
    if any(k in text for k in ["jump", "plyo", "leg extension", "box jump", "hop", "lunge"]):
        contras.append("knee")
    # Shoulder contraindication: heavy overhead pressing, behind-neck, dips
    if any(k in text for k in ["overhead press", "behind the neck", "dip", "upright row", "arnold press"]):
        contras.append("shoulder")
    # Back contraindication: axial load, heavy deadlifts, good morning
    if any(k in text for k in ["deadlift", "good morning", "barbell row", "back extension"]):
        contras.append("back")
    # Wrist contraindication: heavy front rack, clean
    if any(k in text for k in ["clean", "front squat", "wrist roller"]):
        contras.append("wrist")
    # Hip contraindication: extreme groin, pistol squat
    if any(k in text for k in ["pistol squat", "hip abduction", "hip adduction"]):
        contras.append("hip")
        
    return sorted(list(set(contras)))

def main():
    with open(DATASET_PATH, "r") as f:
        raw_data = json.load(f)

    raw_exercises = raw_data.get("exercises", raw_data) if isinstance(raw_data, dict) else raw_data
    print(f"Loaded {len(raw_exercises)} exercises from {DATASET_PATH}")

    normalized = []
    image_disk_files = set(os.listdir(PUBLIC_IMAGES_DIR))

    for ex in raw_exercises:
        ex_id = ex["id"]
        name = ex.get("name_en") or ex_id.replace("-", " ").title()
        description = ex.get("description_en") or ""
        instructions = ex.get("instructions_en") or []
        tips = ex.get("tips_en") or []
        raw_category = ex.get("category", "strength")
        force_type = ex.get("force_type")
        mechanic = ex.get("mechanic")
        difficulty = ex.get("difficulty", "beginner")
        body_part = ex.get("body_part", "full_body")
        raw_primary = ex.get("primary_muscles", [])
        raw_secondary = ex.get("secondary_muscles", [])
        raw_equipment = ex.get("equipment")
        is_bodyweight = ex.get("is_bodyweight", False)
        is_unilateral = ex.get("is_unilateral", False)
        goals = ex.get("goals", [])
        tags = ex.get("tags", [])

        # Map primary muscles to canonical MuscleGroup
        primary_muscles = []
        for m in raw_primary:
            canonical = MUSCLE_MAP.get(m)
            if canonical and canonical not in primary_muscles:
                primary_muscles.append(canonical)
        if not primary_muscles:
            if body_part == "chest": primary_muscles = ["chest"]
            elif body_part in ["back", "upper_back", "lower_back"]: primary_muscles = ["back"]
            elif body_part == "shoulders": primary_muscles = ["shoulders"]
            elif body_part in ["arms", "upper_arms", "lower_arms"]: primary_muscles = ["arms"]
            elif body_part in ["legs", "upper_legs", "lower_legs"]: primary_muscles = ["legs"]
            elif body_part in ["core", "abs"]: primary_muscles = ["core"]
            else: primary_muscles = ["full_body"]

        # Map secondary muscles
        secondary_muscles = []
        for m in raw_secondary:
            canonical = MUSCLE_MAP.get(m)
            if canonical and canonical not in secondary_muscles and canonical not in primary_muscles:
                secondary_muscles.append(canonical)

        # Map equipment
        if is_bodyweight or not raw_equipment:
            equipment_needed = ["bodyweight"]
        elif raw_equipment in EQUIPMENT_DIRECT:
            equipment_needed = EQUIPMENT_DIRECT[raw_equipment]
        else:
            equipment_needed = ["fully_equipped_gym"]

        # Images validation
        flat_imgs = ex.get("images", {}).get("flat", {})
        start_img = flat_imgs.get("start")
        peak_img = flat_imgs.get("peak")
        main_img = flat_imgs.get("main")

        start_img_clean = None
        peak_img_clean = None
        main_img_clean = None

        if start_img:
            base = os.path.basename(start_img)
            if base in image_disk_files:
                start_img_clean = f"/images/flat/{base}"
        if peak_img:
            base = os.path.basename(peak_img)
            if base in image_disk_files:
                peak_img_clean = f"/images/flat/{base}"
        if main_img:
            base = os.path.basename(main_img)
            if base in image_disk_files:
                main_img_clean = f"/images/flat/{base}"

        # If only start or peak exists, set main_img_clean
        if not main_img_clean and start_img_clean:
            main_img_clean = start_img_clean
        elif not main_img_clean and peak_img_clean:
            main_img_clean = peak_img_clean

        # Defaults for sets / reps / rest
        if raw_category == "stretching":
            default_sets = 2
            default_reps = "30-45s hold"
            default_rest = 30
        elif raw_category == "cardio":
            default_sets = 3
            default_reps = "45s work / 15s rest"
            default_rest = 45
        elif difficulty == "beginner":
            default_sets = 3
            default_reps = "10-12"
            default_rest = 60
        elif difficulty == "advanced":
            default_sets = 4
            default_reps = "6-8"
            default_rest = 90
        else:
            default_sets = 3
            default_reps = "8-12"
            default_rest = 60

        is_low_impact = raw_category in ["stretching", "cardio"] or (is_bodyweight and "jump" not in tags)
        contras = detect_contraindications(ex)

        # Review status: approved if in approved core set, otherwise pending_review
        review_status = "approved" if (ex_id in APPROVED_CORE_IDS or ex_id.replace("_", "-") in APPROVED_CORE_IDS) else "pending_review"

        item = {
            "id": ex_id,
            "name": name,
            "description": description,
            "primaryMuscles": primary_muscles,
            "secondaryMuscles": secondary_muscles,
            "equipmentNeeded": equipment_needed,
            "difficulty": difficulty,
            "instructions": instructions,
            "commonMistakes": [],
            "safetyNotes": tips[0] if tips else "Maintain controlled tempo and full range of motion.",
            "contraindications": contras,
            "isLowImpact": is_low_impact,
            "alternativeExerciseIds": [],
            "defaultSets": default_sets,
            "defaultReps": default_reps,
            "defaultRestSeconds": default_rest,
            # RepDB master fields
            "startImage": start_img_clean,
            "peakImage": peak_img_clean,
            "mainImage": main_img_clean,
            "rawEquipment": raw_equipment,
            "rawPrimaryMuscles": raw_primary,
            "rawSecondaryMuscles": raw_secondary,
            "category": raw_category,
            "mechanic": mechanic,
            "forceType": force_type,
            "bodyPart": body_part,
            "tips": tips,
            "goals": goals,
            "tags": tags,
            "isBodyweight": is_bodyweight,
            "isUnilateral": is_unilateral,
            "reviewStatus": review_status,
            "sourceProvider": "RepDB",
            "sourceVersion": "1.0",
            "attribution": "Exercise data by RepDB (repdb.co)"
        }
        normalized.append(item)

    # Save to JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w") as f:
        json.dump(normalized, f, indent=2)
    print(f"Exported {len(normalized)} normalized exercises to {OUTPUT_JSON_PATH}")

    # Generate TypeScript module
    with open(OUTPUT_TS_PATH, "w") as f:
        f.write('// Auto-generated by scripts/build_master_library.py - DO NOT EDIT MANUALLY\n')
        f.write('import { Exercise, MuscleGroup, EquipmentOption, RestrictionType } from "../engine/types";\n')
        f.write('import masterExercisesRaw from "./repdb_exercises.json";\n\n')
        f.write('export const MASTER_EXERCISE_LIBRARY: Exercise[] = masterExercisesRaw as Exercise[];\n\n')
        f.write('export const REPDB_ATTRIBUTION = {\n')
        f.write('  label: "Exercise data by RepDB (repdb.co)",\n')
        f.write('  url: "https://repdb.co",\n')
        f.write('  source: "RepDB Exercise Dataset v1.0",\n')
        f.write('  totalCount: masterExercisesRaw.length,\n')
        f.write('};\n\n')
        f.write('/** Lookup exercise by ID */\n')
        f.write('export function getExerciseById(id: string): Exercise | undefined {\n')
        f.write('  if (!id) return undefined;\n')
        f.write('  const cleanId = id.trim().toLowerCase();\n')
        f.write('  return MASTER_EXERCISE_LIBRARY.find(\n')
        f.write('    (e) => e.id === cleanId || e.id === cleanId.replace(/_/g, "-") || e.id === cleanId.replace(/-/g, "_")\n')
        f.write('  );\n')
        f.write('}\n\n')
        f.write('/** Filter master library with rich criteria */\n')
        f.write('export function filterMasterExercises(options: {\n')
        f.write('  search?: string;\n')
        f.write('  primaryMuscle?: MuscleGroup | "all";\n')
        f.write('  equipment?: EquipmentOption | "all";\n')
        f.write('  difficulty?: "beginner" | "intermediate" | "advanced" | "all";\n')
        f.write('  category?: string | "all";\n')
        f.write('  isBodyweightOnly?: boolean;\n')
        f.write('  isHomeOnly?: boolean;\n')
        f.write('  reviewStatus?: "approved" | "pending_review" | "rejected" | "all";\n')
        f.write('}): Exercise[] {\n')
        f.write('  const { search, primaryMuscle, equipment, difficulty, category, isBodyweightOnly, isHomeOnly, reviewStatus } = options;\n')
        f.write('  const q = search ? search.trim().toLowerCase() : "";\n\n')
        f.write('  return MASTER_EXERCISE_LIBRARY.filter((ex) => {\n')
        f.write('    if (q) {\n')
        f.write('      const matchName = ex.name.toLowerCase().includes(q);\n')
        f.write('      const matchDesc = ex.description.toLowerCase().includes(q);\n')
        f.write('      const matchEquip = (ex.rawEquipment || "").toLowerCase().includes(q);\n')
        f.write('      const matchMuscle = (ex.rawPrimaryMuscles || []).some(m => m.toLowerCase().includes(q));\n')
        f.write('      if (!matchName && !matchDesc && !matchEquip && !matchMuscle) return false;\n')
        f.write('    }\n')
        f.write('    if (primaryMuscle && primaryMuscle !== "all") {\n')
        f.write('      if (!ex.primaryMuscles.includes(primaryMuscle)) return false;\n')
        f.write('    }\n')
        f.write('    if (equipment && equipment !== "all") {\n')
        f.write('      if (!ex.equipmentNeeded.includes(equipment)) return false;\n')
        f.write('    }\n')
        f.write('    if (difficulty && difficulty !== "all") {\n')
        f.write('      if (ex.difficulty !== difficulty) return false;\n')
        f.write('    }\n')
        f.write('    if (category && category !== "all") {\n')
        f.write('      if (ex.category !== category) return false;\n')
        f.write('    }\n')
        f.write('    if (isBodyweightOnly && !ex.isBodyweight && !ex.equipmentNeeded.includes("bodyweight")) {\n')
        f.write('      return false;\n')
        f.write('    }\n')
        f.write('    if (isHomeOnly) {\n')
        f.write('      const hasHomeEquip = ex.equipmentNeeded.some(eq => eq === "bodyweight" || eq === "dumbbells" || eq === "resistance_bands" || eq === "basic_home_gym");\n')
        f.write('      const requiresGymMachine = ex.equipmentNeeded.length === 1 && ex.equipmentNeeded[0] === "fully_equipped_gym";\n')
        f.write('      if (requiresGymMachine || !hasHomeEquip) return false;\n')
        f.write('    }\n')
        f.write('    if (reviewStatus && reviewStatus !== "all") {\n')
        f.write('      if (ex.reviewStatus !== reviewStatus) return false;\n')
        f.write('    }\n')
        f.write('    return true;\n')
        f.write('  });\n')
        f.write('}\n')

    print(f"Exported TypeScript exercise library to {OUTPUT_TS_PATH}")

if __name__ == "__main__":
    main()
