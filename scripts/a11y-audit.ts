import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/login",
  "/register",
  "/reset",
  "/forgot-password",
  "/home",
  "/listings",
  "/listings/example",
  "/profile",
  "/favourites",
  "/interests",
  "/notifications",
  "/notification-preferences",
  "/settings/notifications",
  "/list-for-adoption",
  "/my-listings/example",
  "/adoption/example/settlement",
  "/adoption/example/timeline",
  "/admin/approvals",
  "/admin/disputes",
  "/shelter/approvals",
  "/disputes",
  "/disputes/example",
  "/custody/example/timeline",
];

const baseUrl = process.env.A11Y_BASE_URL ?? "http://127.0.0.1:4321";

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
});
const context = await browser.newContext();
const page = await context.newPage();
const results: Array<{ route: string; violations: number; impact: string }> = [];

for (const route of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 15_000 });
  const report = await new AxeBuilder({ page }).analyze();
  const impact = report.violations.reduce<Record<string, number>>((counts, violation) => {
    const key = violation.impact ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
  results.push({
    route,
    violations: report.violations.length,
    impact: Object.entries(impact)
      .map(([level, count]) => `${level}: ${count}`)
      .join(", ") || "none",
  });
}

console.table(results);
await browser.close();

if (results.some(({ violations }) => violations > 0)) {
  process.exitCode = 1;
}
