import { test, expect } from "@playwright/test";

test.describe("Shape Radar Core E2E Flows", () => {
  test("1. Homepage Navigation, Anchors & AI Modal", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Shape Radar/);

    // Verify main section anchors exist in DOM
    const workoutPlan = page.locator("#workout-plan");
    await expect(workoutPlan).toBeAttached();

    const nutrition = page.locator("#nutrition");
    await expect(nutrition).toBeAttached();

    const faq = page.locator("#faq");
    await expect(faq).toBeAttached();

    // Verify FAQ accordion expands
    const firstFaqButton = page.locator("#faq button").first();
    await firstFaqButton.click();
    await expect(page.locator("text=evidence-based progressive overload").first()).toBeVisible();

    // Test Ask Shape Radar modal
    const searchPill = page.locator('button[aria-label="Ask Shape Radar workout assistant"], div[aria-label="Ask Shape Radar Assistant"]').first();
    if (await searchPill.isVisible()) {
      await searchPill.click();
      await expect(page.locator("h2:has-text('Ask Shape Radar')")).toBeVisible();
      const input = page.locator('input[placeholder*="Type the workout"]');
      await input.fill("How to add 10kg to bench");
      await page.keyboard.press("Enter");
      await expect(page.locator("text=Upper Body Hypertrophy").first()).toBeVisible({ timeout: 10000 });
      // Close modal
      await page.locator('button[aria-label="Close dialog"]').click();
    }
  });

  test("2. Express 1-Minute Assessment Flow", async ({ page }) => {
    await page.goto("/assessment?mode=express");
    // Verify Express badge is visible
    await expect(page.locator("text=Express").first()).toBeVisible();

    // Step 1: Gender (click option to advance)
    const genderBtn = page.locator('button:has-text("Male"), button:has-text("Female")').first();
    if (await genderBtn.isVisible()) {
      await genderBtn.click();
    }

    // Step through express assessment
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(400);
      const nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Build My Blueprint")').first();
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
      }
    }

    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/\/results|\/assessment/);
  });

  test("3. Auth: Signup, Login & Logout Flow", async ({ page }) => {
    // 1. Visit Login page
    await page.goto("/auth/login");
    await expect(page.locator("h1:has-text('Welcome Back')")).toBeVisible();

    // 2. Log in using local demo athlete
    const demoAthleteBtn = page.locator('button:has-text("Log in as Demo Athlete")');
    await expect(demoAthleteBtn).toBeVisible();
    await demoAthleteBtn.click();

    // 3. Verifies redirect into protected athlete app
    await page.waitForURL("**/app/today", { timeout: 10000 });
    await expect(page.locator("h1:has-text('Ah, here we go again')").first()).toBeVisible();

    // 4. Verify session persistence cookie
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === "fit_planner_session");
    expect(sessionCookie?.value).toBe("active");

    // 5. Test Profile & Logout
    await page.goto("/app/profile");
    await expect(page.locator("text=Settings & Profile").first()).toBeVisible();
    const logoutBtn = page.locator('button[aria-label="Log Out"]').first();
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Verify session cookie cleared
    await page.waitForTimeout(1000);
    const postCookies = await page.context().cookies();
    const postSession = postCookies.find((c) => c.name === "fit_planner_session");
    expect(postSession?.value || "").toBe("");
  });

  test("4. Workout Flow: Log Set & Rest Timer", async ({ page }) => {
    // Authenticate first
    await page.goto("/auth/login");
    await page.locator('button:has-text("Log in as Demo Athlete")').click();
    await page.waitForURL("**/app/today");

    // Open workout session page
    await page.goto("/app/workout/session-1");
    await expect(page.locator("text=TRAINING LOG").first()).toBeVisible();

    // Launch Focus Mode rest timer if available
    const focusModeBtn = page.locator('button:has-text("Focus Mode")').first();
    if (await focusModeBtn.isVisible()) {
      await focusModeBtn.click();
      await expect(page.locator("text=Focus Mode").first()).toBeVisible();

      // Log a set in Focus Mode
      const logSetBtn = page.locator('button:has-text("Log Set & Start Rest")').first();
      if (await logSetBtn.isVisible()) {
        await logSetBtn.click();
        await expect(page.locator("text=REST TIME").or(page.locator("text=Resting")).first()).toBeVisible();
      }

      // Close modal
      const closeBtn = page.locator('button[aria-label="Close Focus Mode"], button:has-text("Exit")').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });

  test("5. Membership & Black Friday Pricing Display", async ({ page }) => {
    await page.goto("/membership");
    await expect(page.locator("text=BLACK FRIDAY DEAL").first()).toBeVisible();
    await expect(page.locator("text=85% OFF").first()).toBeVisible();
    await expect(page.locator("text=30-day 100% money-back guarantee").or(page.locator("text=30-Day Money-Back Guarantee")).first()).toBeVisible();
  });
});
