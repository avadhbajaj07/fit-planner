// scripts/check-links.mjs
// Crawls internal routes and asserts 200 HTTP status code

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const ROUTES = [
  "/",
  "/assessment",
  "/assessment?mode=express",
  "/assessment?mode=full",
  "/assessment?goal=hypertrophy",
  "/assessment?goal=fat_loss",
  "/assessment?goal=strength",
  "/assessment?goal=longevity",
  "/membership",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json"
];

async function checkLinks() {
  console.log(`Starting link crawler against ${BASE_URL}...\n`);
  let failures = 0;
  let successes = 0;

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    try {
      const res = await fetch(url, { redirect: "manual" });
      const status = res.status;

      if (status === 200) {
        console.log(`✓ [200 OK] ${route}`);
        successes++;
      } else if (status === 307 || status === 308 || status === 302 || status === 301) {
        const location = res.headers.get("location");
        console.log(`↷ [${status} Redirect] ${route} -> ${location}`);
        successes++;
      } else {
        console.error(`✗ [${status} ERROR] ${route}`);
        failures++;
      }
    } catch (err) {
      console.error(`✗ [NETWORK ERROR] ${route}:`, err.message);
      failures++;
    }
  }

  // Also test protected route redirection
  console.log("\nTesting Protected Routes Redirection (Middleware)...");
  try {
    const appRes = await fetch(`${BASE_URL}/app/today`, { redirect: "manual" });
    if (appRes.status === 307 || appRes.status === 308 || appRes.status === 302) {
      console.log(`✓ [${appRes.status} PROTECTED REDIRECT] /app/today -> ${appRes.headers.get("location")}`);
      successes++;
    } else {
      console.error(`✗ Expected redirect on /app/today, received ${appRes.status}`);
      failures++;
    }

    const adminRes = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    if (adminRes.status === 307 || adminRes.status === 308 || adminRes.status === 302) {
      console.log(`✓ [${adminRes.status} PROTECTED REDIRECT] /admin -> ${adminRes.headers.get("location")}`);
      successes++;
    } else {
      console.error(`✗ Expected redirect on /admin, received ${adminRes.status}`);
      failures++;
    }
  } catch (err) {
    console.error("✗ Protected route error:", err.message);
    failures++;
  }

  // Also test AI assistant endpoint
  console.log("\nTesting /api/ai/ask endpoint...");
  try {
    const aiRes = await fetch(`${BASE_URL}/api/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "How to increase bench press" })
    });
    if (aiRes.status === 200) {
      const json = await aiRes.json();
      if (json.success && json.result?.headline) {
        console.log(`✓ [200 OK] /api/ai/ask -> Headline: "${json.result.headline}"`);
        successes++;
      } else {
        console.error("✗ /api/ai/ask response format invalid", json);
        failures++;
      }
    } else {
      console.error(`✗ /api/ai/ask returned status ${aiRes.status}`);
      failures++;
    }
  } catch (err) {
    console.error("✗ /api/ai/ask error:", err.message);
    failures++;
  }

  console.log(`\nCrawler finished: ${successes} passed, ${failures} failed.`);
  if (failures > 0) {
    process.exit(1);
  }
}

checkLinks();
