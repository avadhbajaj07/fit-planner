-- FIT Planner Seed Data
-- Clearly marked as Sample / Demo data to be reviewed by qualified trainers

INSERT INTO public.exercises (
  id, name, description, primary_muscles, secondary_muscles,
  equipment_needed, difficulty, instructions, common_mistakes,
  safety_notes, contraindications, is_low_impact, alternative_exercise_ids,
  default_sets, default_reps, default_rest_seconds
) VALUES
(
  'push_up',
  'Standard Push-Up',
  'Classic horizontal pressing exercise targeting chest, front deltoids, and triceps.',
  ARRAY['chest'],
  ARRAY['shoulders', 'arms', 'core'],
  ARRAY['bodyweight'],
  'beginner',
  ARRAY['Place hands slightly wider than shoulders.', 'Lower chest to 90 degree elbows.', 'Press firmly away.'],
  ARRAY['Sagging hips', 'Flaring elbows'],
  'Keep wrists neutral.',
  ARRAY['shoulder'],
  TRUE,
  ARRAY['incline_push_up', 'floor_press_dumbbell'],
  3, '8-12', 60
),
(
  'dumbbell_bench_press',
  'Flat Dumbbell Bench Press',
  'Fundamental compound chest press allowing independent arm freedom.',
  ARRAY['chest'],
  ARRAY['shoulders', 'arms'],
  ARRAY['dumbbells', 'basic_home_gym'],
  'intermediate',
  ARRAY['Plant feet firmly.', 'Press dumbbells upward in a gentle arc.', 'Lower smoothly with elbows at 45 degrees.'],
  ARRAY['Flaring elbows excessively', 'Arching excessively'],
  'Do not drop weights below chest level if anterior shoulder sensitivity exists.',
  ARRAY['shoulder'],
  TRUE,
  ARRAY['floor_press_dumbbell', 'push_up'],
  4, '8-10', 90
),
(
  'dumbbell_row',
  'Single-Arm Dumbbell Row',
  'Unilateral pulling exercise strengthening lats, rhomboids, and lower back stability.',
  ARRAY['back'],
  ARRAY['arms', 'core'],
  ARRAY['dumbbells'],
  'beginner',
  ARRAY['Hinge torso forward with flat back.', 'Pull elbow up toward hip.', 'Lower with full stretch.'],
  ARRAY['Twisting torso', 'Jerking weight'],
  'Maintain neutral cervical and lumbar spine.',
  ARRAY[]::TEXT[],
  TRUE,
  ARRAY['band_row'],
  3, '10-12', 60
),
(
  'bodyweight_squat',
  'Bodyweight Air Squat',
  'Foundational lower body compound exercise.',
  ARRAY['legs'],
  ARRAY['core'],
  ARRAY['bodyweight'],
  'beginner',
  ARRAY['Feet shoulder-width apart.', 'Sit hips back and down to parallel.', 'Drive through heels to stand.'],
  ARRAY['Knees caving in', 'Heels rising'],
  'Contraindicated for acute knee pain.',
  ARRAY['knee'],
  TRUE,
  ARRAY['box_squat', 'glute_bridge'],
  3, '12-15', 60
),
(
  'box_squat',
  'Knee-Friendly Box Squat',
  'Controlled squat to chair or bench eliminating knee shear forces.',
  ARRAY['legs'],
  ARRAY['core'],
  ARRAY['bodyweight'],
  'beginner',
  ARRAY['Sit gently onto box without bouncing.', 'Pause 1 second.', 'Drive through heels to stand.'],
  ARRAY['Bouncing off box'],
  'Gentle regression for knee sensitivity.',
  ARRAY[]::TEXT[],
  TRUE,
  ARRAY['glute_bridge'],
  3, '10-12', 60
),
(
  'glute_bridge',
  'Floor Glute Bridge',
  'Zero knee-impact, zero spinal-compression glute and hamstring exercise.',
  ARRAY['legs'],
  ARRAY['core'],
  ARRAY['bodyweight'],
  'beginner',
  ARRAY['Lie on back with knees bent at 90 degrees.', 'Drive heels into floor to raise hips.', 'Squeeze glutes at top.'],
  ARRAY['Overarching lower back'],
  'Safe for both knee and lower back restrictions.',
  ARRAY[]::TEXT[],
  TRUE,
  ARRAY['single_leg_glute_bridge'],
  3, '12-15', 45
)
ON CONFLICT (id) DO NOTHING;

-- Seed Site Settings
INSERT INTO public.site_settings (key, value_json)
VALUES (
  'platform_config',
  '{
    "brandName": "FIT Planner",
    "tagline": "Your Goals. Your Body. Your Plan.",
    "activePaymentProvider": "none",
    "supportedCurrencies": ["CHF", "EUR", "USD", "INR"],
    "minimumAge": 18,
    "consentProtocolVersion": "1.2"
  }'::JSONB
)
ON CONFLICT (key) DO NOTHING;
