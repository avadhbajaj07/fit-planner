import { UserProfile } from "../auth/authContext";

export type AccessLevel =
  | "visitor"
  | "registered_free"
  | "active_subscriber"
  | "expired_subscriber"
  | "admin";

export function determineAccessLevel(user: UserProfile | null): AccessLevel {
  if (!user) return "visitor";
  if (user.role === "admin") return "admin";

  if (user.membershipStatus === "active") {
    return "active_subscriber";
  }

  if (user.membershipStatus === "expired") {
    return "expired_subscriber";
  }

  return "registered_free";
}

export function canAccessFeature(
  user: UserProfile | null,
  feature: "view_today" | "log_workout" | "focus_mode" | "nutrition_module" | "advanced_analytics"
): { allowed: boolean; reason?: string } {
  const level = determineAccessLevel(user);

  if (level === "admin" || level === "active_subscriber") {
    return { allowed: true };
  }

  if (level === "visitor") {
    return {
      allowed: false,
      reason: "Please complete your assessment or log in to view this feature."
    };
  }

  // Registered free user (e.g. previewing workout)
  if (feature === "view_today" || feature === "log_workout" || feature === "focus_mode") {
    // Free preview granted during demo/evaluation period
    return { allowed: true };
  }

  if (feature === "advanced_analytics" || feature === "nutrition_module") {
    return {
      allowed: false,
      reason: "This feature is included in Active Memberships."
    };
  }

  return { allowed: true };
}
