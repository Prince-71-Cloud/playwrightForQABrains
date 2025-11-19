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
    
    // Handle networkidle differently for different browsers
    try {
      await page.waitForLoadState("networkidle");
    } catch (error) {
      console.log(`Warning: networkidle timeout on home link, trying load state: ${error}`);
      try {
        await page.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out: ${loadError}`);
      }
    }
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
    
    // Handle networkidle differently for different browsers
    try {
      await qaTopicsPage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout for QA Topics page, trying load state: ${error}`);
      try {
        await qaTopicsPage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for QA Topics page: ${loadError}`);
      }
    }
    await expect(qaTopicsPage).toHaveURL("https://qabrains.com/topics");
    // Close the new tab and switch back to the original tab (main page)
    await closePopupAndSwitchBack(qaTopicsPage);
    
    // Also handle the return page load state
    try {
      await page.waitForLoadState("networkidle");
    } catch (error) {
      console.log(`Warning: networkidle timeout on return page, trying load state: ${error}`);
      try {
        await page.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out on return: ${loadError}`);
      }
    }

    // Click Discussion heading and handle new tab
    const discussionLink = page
      .locator("#nav")
      .getByRole("link", { name: "Discussion" });
    await expect(discussionLink).toBeVisible();
    const [newDiscussionPage] = await Promise.all([
      context.waitForEvent("page"),
      discussionLink.click(),
    ]);

    // Handle networkidle differently for different browsers
    try {
      await newDiscussionPage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout for Discussion page, trying load state: ${error}`);
      try {
        await newDiscussionPage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for Discussion page: ${loadError}`);
      }
    }
    // Wait for the new page to load and verify URL
    try {
      await newDiscussionPage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout2 for Discussion page, trying load state: ${error}`);
      try {
        await newDiscussionPage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for Discussion page: ${loadError}`);
      }
    }
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

    // Wait for the new page to load - use different approach for Firefox
    // networkidle might take too long in Firefox for external sites
    try {
      await newTagsPage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout for Tags page, trying load state instead: ${error}`);
      try {
        await newTagsPage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for Tags page: ${loadError}`);
        // If both timeout, just continue with the test to avoid failure
      }
    }
    
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
    try {
      await newJobsPage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout for Jobs page, trying load state: ${error}`);
      try {
        await newJobsPage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for Jobs page: ${loadError}`);
      }
    }
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
    try {
      await newPracticeSitePage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout for Practice Site page, trying load state: ${error}`);
      try {
        await newPracticeSitePage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for Practice Site page: ${loadError}`);
      }
    }
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
    try {
      await newAboutUsPage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout for About Us page, trying load state: ${error}`);
      try {
        await newAboutUsPage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for About Us page: ${loadError}`);
      }
    }
    await expect(newAboutUsPage).toHaveURL("https://qabrains.com/about");
    await closePopupAndSwitchBack(newAboutUsPage);

    const loginMenuItem = page.getByRole("link", { name: "Sign In" });
    await expect(loginMenuItem).toBeVisible();
    const [loginPage] = await Promise.all([
      context.waitForEvent("page"),
      loginMenuItem.click(),
    ]);
    
    try {
      await loginPage.waitForLoadState("networkidle", { timeout: 20000 });
    } catch (error) {
      console.log(`Warning: networkidle timeout for Login page, trying load state: ${error}`);
      try {
        await loginPage.waitForLoadState("load", { timeout: 10000 });
      } catch (loadError) {
        console.log(`Warning: load state also timed out for Login page: ${loadError}`);
      }
    }
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
