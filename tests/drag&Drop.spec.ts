import { test, expect } from "@playwright/test";

test("Drag and Drop Debug", async ({ page }) => {
  await page.goto("https://practice.qabrains.com/");
  await page.getByText("Drag and Drop List").click();
  await page.waitForLoadState("networkidle");

  // --- REPLACE THE LOCATORS BELOW WITH WHAT YOU FOUND ---
  const source = page.getByText("Drag Me").first();

  // Try this generic text locator first. If it fails, use the one you found in Inspector.
  const target = page.getByText("Drop Here").first();
  // -----------------------------------------------------

  // Get Coordinates
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (sourceBox && targetBox) {
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const targetX = targetBox.x + targetBox.width / 2;
    const targetY = targetBox.y + targetBox.height / 2;

    // Drag with steps
    await page.mouse.move(sourceX, sourceY);
    await page.mouse.down();
    await page.mouse.move(targetX, targetY, { steps: 20 });
    await page.mouse.up();
  }

  await expect(page.getByRole("heading", { name: "Dropped!" })).toBeVisible();
});
