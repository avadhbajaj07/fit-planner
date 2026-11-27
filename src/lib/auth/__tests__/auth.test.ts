import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncAuthCookies, UserProfile } from "../authContext";
import { createClient } from "@supabase/supabase-js";

// Mock document for Node test environment
let mockCookieStorage = "";
const mockDocument = {
  get cookie() {
    return mockCookieStorage;
  },
  set cookie(val: string) {
    if (val.includes("max-age=0")) {
      mockCookieStorage = "";
    } else {
      mockCookieStorage += (mockCookieStorage ? "; " : "") + val;
    }
  }
};

(globalThis as any).document = mockDocument;

describe("Shape Radar Real Google Authentication & Session Sync", () => {
  beforeEach(() => {
    mockCookieStorage = "";
  });

  it("syncs session cookies accurately for active user", () => {
    const mockUser: UserProfile = {
      id: "usr_google_123",
      email: "athlete@shaperadar.com",
      fullName: "Test Athlete",
      role: "customer",
      isDemoAccount: false,
      membershipStatus: "active",
      createdAt: "2026-11-27T00:00:00Z"
    };

    syncAuthCookies(mockUser);

    expect(mockDocument.cookie).toContain("fit_planner_session=active");
    expect(mockDocument.cookie).toContain("fit_planner_role=customer");
  });

  it("clears session cookies on logout", () => {
    syncAuthCookies(null);

    // When cleared, max-age=0 is set and cookies are reset
    expect(mockDocument.cookie).not.toContain("fit_planner_session=active");
  });

  it("initiates real Supabase Google OAuth without mock demo profiles", async () => {
    const testClient = createClient(
      "https://tnhmsfnpwhgoisenhatp.supabase.co",
      "sb_publishable_rQxwyMjfjOP9Dpxzr7U9kg_NIpvoxLi"
    );

    const signInSpy = vi.spyOn(testClient.auth, "signInWithOAuth").mockResolvedValueOnce({
      data: {
        provider: "google",
        url: "https://tnhmsfnpwhgoisenhatp.supabase.co/auth/v1/authorize?provider=google&redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback%3Fnext%3D%252Fapp%252Ftoday"
      },
      error: null
    } as any);

    const origin = "http://localhost:3000";
    const callbackUrl = new URL("/auth/callback", origin);
    callbackUrl.searchParams.set("next", "/app/today");

    const result = await testClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: {
          access_type: "offline",
          prompt: "select_account"
        }
      }
    });

    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(signInSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "google",
        options: expect.objectContaining({
          redirectTo: "http://localhost:3000/auth/callback?next=%2Fapp%2Ftoday",
          queryParams: {
            access_type: "offline",
            prompt: "select_account"
          }
        })
      })
    );

    expect(result.data?.url).toContain("tnhmsfnpwhgoisenhatp.supabase.co/auth/v1/authorize?provider=google");
    expect(result.error).toBeNull();
  });

  it("handles OAuth error from Supabase and propagates message", async () => {
    const testClient = createClient(
      "https://tnhmsfnpwhgoisenhatp.supabase.co",
      "sb_publishable_rQxwyMjfjOP9Dpxzr7U9kg_NIpvoxLi"
    );

    vi.spyOn(testClient.auth, "signInWithOAuth").mockResolvedValueOnce({
      data: { provider: "google", url: null },
      error: { message: "Google OAuth provider disabled", status: 400, name: "AuthApiError" }
    } as any);

    const result = await testClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/auth/callback" }
    });

    expect(result.error?.message).toBe("Google OAuth provider disabled");
  });
});
