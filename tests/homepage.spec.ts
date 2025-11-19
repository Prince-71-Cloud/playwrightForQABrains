import { test, expect, Page } from "@playwright/test";

const baseURL = "https://practice.qabrains.com";
const TIMEOUTS = {
  DEFAULT: 30000,
  PAGE_LOAD: 60000,
  TEST_TOTAL: 300000,
  API_CALL: 20000,
};
test.describe("QA Brains Website Complete Navigation Test", () => {
  test.setTimeout(TIMEOUTS.TEST_TOTAL); // Set timeout to 5 minutes
  test("verify all navigation links and buttons functionality", async ({
    page,
    context,
  }) => {
    // Navigate to the website
    await page.goto(`${baseURL}`);

    // Verify page title and main heading
    await expect(page).toHaveTitle("QA Practice Site");
    const heading = page.getByRole("heading", { name: "QA Practice Site" });
    await expect(heading).toBeVisible();

    // Test internal navigation links
    const logoLink = page.getByRole("link", { name: "Logo (Practice Site)" });
    await expect(logoLink).toBeVisible();

    // Test home link
    const homeLink = page.getByRole("link", { name: "Home" });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(`${baseURL}`);

    // Helper to close popup and switch back
    const closePopupAndSwitchBack = async (popupPage: Page | null) => {
      if (popupPage && !popupPage.isClosed()) {
        await popupPage.close();
      }
      await page.bringToFront(); // Ensure focus is back
    };

    // Click QA Topics heading and handle new tab
    const qaTopicsLink = page.getByRole("link", { name: "QA Topics" });
    await expect(qaTopicsLink).toBeVisible();

    const [qaTopicsPage] = await Promise.all([
      context.waitForEvent("page"), // Correct: use context
      qaTopicsLink.click(),
    ]);
    await qaTopicsPage.waitForLoadState("networkidle");
    await expect(qaTopicsPage).toHaveURL("https://qabrains.com/topics");
    // Close the new tab and switch back to the original tab (main page)
    await closePopupAndSwitchBack(qaTopicsPage);
    await page.waitForLoadState("networkidle");

    // Click Discussion heading and handle new tab
    const discussionLink = page
      .locator("#nav")
      .getByRole("link", { name: "Discussion" });
    await expect(discussionLink).toBeVisible();
    const [newDiscussionPage] = await Promise.all([
      context.waitForEvent("page"),
      discussionLink.click(),
    ]);

    await newDiscussionPage.waitForLoadState("networkidle");
    // Wait for the new page to load and verify URL
    await newDiscussionPage.waitForLoadState("networkidle");
    await expect(newDiscussionPage).toHaveURL(
      "https://qabrains.com/discussion"
    );
    await closePopupAndSwitchBack(newDiscussionPage);

    // Click Tags heading and handle new tab
    const tagsLink = page.locator("#nav").getByRole("link", { name: "Tags" });
    await expect(tagsLink).toBeVisible();
    const [newTagsPage] = await Promise.all([
      context.waitForEvent("page"),
      tagsLink.click(),
    ]);

    // Wait for the new page to load and verify URL with timeout
    await newTagsPage.waitForLoadState("networkidle", { timeout: TIMEOUTS.PAGE_LOAD });
    await expect(newTagsPage).toHaveURL("https://qabrains.com/tags");
    await closePopupAndSwitchBack(newTagsPage);

    // Click Discussion heading and handle new tab
    const jobsLink = page.locator("#nav").getByRole("link", { name: "Jobs" });
    await expect(jobsLink).toBeVisible();
    const [newJobsPage] = await Promise.all([
      context.waitForEvent("page"),
      jobsLink.click(),
    ]);
    // Wait for the new page to load and verify URL
    await newJobsPage.waitForLoadState("networkidle");
    await expect(newJobsPage).toHaveURL("https://qabrains.com/jobs");
    await closePopupAndSwitchBack(newJobsPage);

    // Click Practice Site heading and handle new tab
    const practiceSiteLink = page
      .locator("#nav")
      .getByRole("link", { name: "Practice Site" });
    await expect(practiceSiteLink).toBeVisible();
    const [newPracticeSitePage] = await Promise.all([
      context.waitForEvent("page"),
      practiceSiteLink.click(),
    ]);
    // Wait for the new page to load and verify URL
    await newPracticeSitePage.waitForLoadState("networkidle");
    await expect(newPracticeSitePage).toHaveURL(
      "https://qabrains.com/practice-site"
    );
    await closePopupAndSwitchBack(newPracticeSitePage);

    // Click About us heading and handle new tab
    const aboutUsLink = page
      .locator("#nav")
      .getByRole("link", { name: "About Us" });
    await expect(aboutUsLink).toBeVisible();
    const [newAboutUsPage] = await Promise.all([
      context.waitForEvent("page"),
      aboutUsLink.click(),
    ]);
    // Wait for the new page to load and verify URL
    await newAboutUsPage.waitForLoadState("networkidle");
    await expect(newAboutUsPage).toHaveURL("https://qabrains.com/about");
    await closePopupAndSwitchBack(newAboutUsPage);

    const loginMenuItem = page.getByRole("link", { name: "Sign In" });
    await expect(loginMenuItem).toBeVisible();
    const [loginPage] = await Promise.all([
      context.waitForEvent("page"),
      loginMenuItem.click(),
    ]);
    await loginPage.waitForLoadState("networkidle");
    await expect(loginPage).toHaveURL("https://qabrains.com/auth/login");
    await closePopupAndSwitchBack(loginPage);
  });

  test("Footer Links Navigation Test", async ({ page, context }) => {
    // Navigate to the website
    await page.goto(`${baseURL}`);

    // Helper to close popup and switch back
    const closePopupAndSwitchBack = async (popupPage: Page | null) => {
      if (popupPage && !popupPage.isClosed()) {
        await popupPage.close();
      }
      await page.bringToFront(); // Ensure focus is back
    };
  });
});
