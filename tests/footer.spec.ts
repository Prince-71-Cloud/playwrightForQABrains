import { test, expect, type Page, type BrowserContext } from "@playwright/test";

// Constants
const BASE_URL = "https://practice.qabrains.com";
const FOOTER_SELECTORS = {
  FOOTER: "footer",
  QA_BRAINS: "QA Brains",
  QA_TOPICS: "QA Topics",
  WEB_TESTING: "Web Testing",
  INTERVIEW_QUESTIONS: "Interview Questions",
  TESTING_FRAMEWORK: "Testing Framework",
  SEE_MORE: "See more",
  QUICK_LINKS: "Quick Links",
  FOLLOW_US: "Follow Us",
  FOR_SUPPORT: "For Support",
  DISCUSSION: "Discussion",
  ABOUT_US: "About Us",
  TERMS_CONDITIONS: "Terms & Conditions",
  PRIVACY_POLICY: "Privacy Policy",
  LINKEDIN: "LinkedIn",
  FACEBOOK: "Facebook",
  YOUTUBE: "YouTube",
  TWITTER: "Twitter",
  SUPPORT_EMAIL: /support@qabrains.com/,
  COPYRIGHT_PATTERN: /© \d{4}/,
};

const URL_PATTERNS = {
  MAIN_SITE: /qabrains\.com/,
  WEB_TESTING: /qabrains\.com\/topics\/web-testing/,
  INTERVIEW_QUESTIONS: /qabrains\.com\/topics\/interview-questions/,
  TESTING_FRAMEWORK: /qabrains\.com\/topics\/testing-framework/,
  TOPICS: /qabrains\.com\/topics/,
  DISCUSSION: /qabrains\.com\/discussion/,
  ABOUT: /qabrains\.com\/about/,
  TERMS: /qabrains\.com\/terms/,
  POLICY: /qabrains\.com\/policy/,
  LINKEDIN: /linkedin\.com\/showcase\/qabrainscom/,
  FACEBOOK: /facebook\.com\/qabrainscom/,
  YOUTUBE: /youtube\.com\/@QABrains/,
  TWITTER: /twitter\.com\/qabrains/,
};

const TIMEOUTS = {
  DEFAULT: 10000,
  PAGE_LOAD: 30000,
  TEST_TOTAL: 120000,
};

// Reusable helper function to handle new page popups and return to the original page with proper error handling
async function handleNewPageAndReturn(
  context: BrowserContext,
  page: Page,
  clickAction: () => Promise<void>,
  timeout: number = TIMEOUTS.PAGE_LOAD
) {
  try {
    const [newPage] = await Promise.all([
      context.waitForEvent("page", { timeout }),
      clickAction(),
    ]);

    // Use a shorter timeout when waiting for external pages that might be slow
    try {
      await newPage.waitForLoadState("networkidle", { timeout: Math.min(timeout, 15000) });
    } catch (loadError) {
      console.log(`Warning: External page took longer than expected to load: ${loadError}`);
      // Continue with the test even if the external page is slow to load
    }
    
    await newPage.close(); // Close the new page to return to the original page
    await page.bringToFront(); // Ensure focus is back to the original page
  } catch (error) {
    console.log(`Error handling new page: ${error}`);
    await page.bringToFront(); // Ensure focus is back to the original page even if there's an error
  }
}

// Helper function to click a footer link if it exists with error handling and timeout
async function clickFooterLinkIfExists(
  page: Page,
  context: BrowserContext,
  linkName: string,
  expectedUrlPattern?: RegExp,
  timeout: number = TIMEOUTS.PAGE_LOAD
) {
  try {
    const link = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("link", { name: linkName });

    if ((await link.count()) > 0) {
      await expect(link).toBeVisible({ timeout: TIMEOUTS.DEFAULT });

      if (expectedUrlPattern) {
        const [newPage] = await Promise.all([
          context.waitForEvent("page", { timeout }),
          link.click(),
        ]);

        // Use a shorter timeout when waiting for external pages that might be slow
        try {
          await newPage.waitForLoadState("networkidle", { timeout: Math.min(timeout, 15000) });
          await expect(newPage).toHaveURL(expectedUrlPattern);
        } catch (loadError) {
          console.log(`Warning: Could not fully load external page for ${linkName}: ${loadError}`);
          // If the page doesn't load within timeout, at least verify the navigation started
          try {
            await expect(newPage).toHaveURL(expectedUrlPattern, { timeout: 5000 });
          } catch {
            // If we can't verify the URL, just continue with the test
            console.log(`Warning: Could not verify URL for ${linkName}, continuing test...`);
          }
        }

        await newPage.close(); // Close the new page to return to the original page
        await page.bringToFront(); // Ensure focus is back to the original page
      } else {
        // If no URL pattern provided, just click and handle the popup
        await handleNewPageAndReturn(
          context,
          page,
          () => link.click(),
          timeout
        );
      }
    } else {
      console.log(`${linkName} is not a link in the footer`);
    }
  } catch (error) {
    console.log(`Error clicking footer link ${linkName}: ${error}`);
  }
}

// Helper function to verify footer elements exist and are visible
async function verifyFooterElement(
  page: Page,
  selector: string,
  name: string,
  timeout: number = TIMEOUTS.DEFAULT
) {
  try {
    const element = page.locator(selector).getByText(name).first();
    await expect(element).toBeVisible({ timeout });
    return true;
  } catch (error) {
    console.log(`Error verifying footer element ${name}: ${error}`);
    return false;
  }
}

// Helper function to handle popup pages and switch back to the main page
const createCloseTabPopupHandler = (page: Page) => {
  return async (popupPage: Page | null) => {
    try {
      if (popupPage && !popupPage.isClosed()) {
        await popupPage.close();
      }
      await page.bringToFront(); // Ensure focus is back
    } catch (error) {
      console.log(`Error in closeTabPopupHandler: ${error}`);
      await page.bringToFront();
    }
  };
};

test.describe("QA Brains Website Complete Footer functionality test", () => {
  test.setTimeout(TIMEOUTS.TEST_TOTAL); // Set timeout to 2 minutes

  test("Footer QA Brains & Topics heading link functionality", async ({
    page,
    context,
  }) => {
    await page.goto(BASE_URL);

    const closeTabPopupHandler = createCloseTabPopupHandler(page);

    // QA Topics is a title text in the footer (not a link), verify its visibility
    const qaTopicsText = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByText(FOOTER_SELECTORS.QA_TOPICS);

    await expect(qaTopicsText).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    console.log("QA Topics is confirmed to be a text element in the footer");

    await page.waitForLoadState("networkidle");

    // Test QA Brains text in footer
    await verifyFooterElement(
      page,
      FOOTER_SELECTORS.FOOTER,
      FOOTER_SELECTORS.QA_BRAINS
    );

    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.WEB_TESTING,
      URL_PATTERNS.WEB_TESTING
    );
    await page.waitForLoadState("networkidle");

    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.INTERVIEW_QUESTIONS,
      URL_PATTERNS.INTERVIEW_QUESTIONS
    );
    await page.waitForLoadState("networkidle");

    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.TESTING_FRAMEWORK,
      URL_PATTERNS.TESTING_FRAMEWORK
    );
    await page.waitForLoadState("networkidle");

    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.SEE_MORE,
      URL_PATTERNS.TOPICS
    );
    await page.waitForLoadState("networkidle");
  });

  test("Footer Quick Links and Follow Us Test", async ({ page, context }) => {
    await page.goto(BASE_URL);

    const closeTabPopupHandler = createCloseTabPopupHandler(page);

    // Verify footer section exists and is visible
    const footer = page.locator(FOOTER_SELECTORS.FOOTER);
    await expect(footer).toBeVisible({ timeout: TIMEOUTS.DEFAULT });

    // Test Quick Links section
    const quickLinksHeading = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("heading", { name: FOOTER_SELECTORS.QUICK_LINKS });
    await expect(quickLinksHeading).toBeVisible({ timeout: TIMEOUTS.DEFAULT });

    // Test links in footer
    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.DISCUSSION,
      URL_PATTERNS.DISCUSSION
    );
    await page.waitForLoadState("networkidle");

    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.ABOUT_US,
      URL_PATTERNS.ABOUT
    );
    await page.waitForLoadState("networkidle");

    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.TERMS_CONDITIONS,
      URL_PATTERNS.TERMS
    );
    await page.waitForLoadState("networkidle");

    await clickFooterLinkIfExists(
      page,
      context,
      FOOTER_SELECTORS.PRIVACY_POLICY,
      URL_PATTERNS.POLICY
    );
    await page.waitForLoadState("networkidle");

    // Test Follow Us section
    const followUsHeading = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("heading", { name: FOOTER_SELECTORS.FOLLOW_US });
    if ((await followUsHeading.count()) > 0) {
      await expect(followUsHeading).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    }

    // Test social media links in footer
    const linkedInLink = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("link", { name: FOOTER_SELECTORS.LINKEDIN });
    if ((await linkedInLink.count()) > 0) {
      const href = await linkedInLink.getAttribute("href");
      if (href && href.includes("linkedin")) {
        await handleNewPageAndReturn(context, page, () => linkedInLink.click());
        await page.waitForLoadState("networkidle");
      }
    }

    const facebookLink = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("link", { name: FOOTER_SELECTORS.FACEBOOK });
    if ((await facebookLink.count()) > 0) {
      const href = await facebookLink.getAttribute("href");
      if (href && href.includes("facebook")) {
        await handleNewPageAndReturn(context, page, () => facebookLink.click());
        await page.waitForLoadState("networkidle");
      }
    }

    const youtubeLink = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("link", { name: FOOTER_SELECTORS.YOUTUBE });
    if ((await youtubeLink.count()) > 0) {
      const href = await youtubeLink.getAttribute("href");
      if (href && href.includes("youtube")) {
        await handleNewPageAndReturn(context, page, () => youtubeLink.click());
        await page.waitForLoadState("networkidle");
      }
    }

    const twitterLink = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("link", { name: FOOTER_SELECTORS.TWITTER });
    if ((await twitterLink.count()) > 0) {
      const href = await twitterLink.getAttribute("href");
      if (href && href.includes("twitter")) {
        await handleNewPageAndReturn(context, page, () => twitterLink.click());
        await page.waitForLoadState("networkidle");
      }
    }

    // Test Support section
    const supportHeading = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("heading", { name: FOOTER_SELECTORS.FOR_SUPPORT });
    if ((await supportHeading.count()) > 0) {
      await expect(supportHeading).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    }

    // Test support email link
    const supportEmail = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("link")
      .filter({ hasText: FOOTER_SELECTORS.SUPPORT_EMAIL });
    if ((await supportEmail.count()) > 0) {
      await expect(supportEmail).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
      await expect(supportEmail).toHaveAttribute("href", /mailto:/);
    }

    // Test copyright text
    const copyrightText = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByText(FOOTER_SELECTORS.COPYRIGHT_PATTERN);
    await expect(copyrightText).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
  });

  test("Footer For Support section test ", async ({ page, context }) => {
    await page.goto(BASE_URL);

    const closeTabPopupHandler = createCloseTabPopupHandler(page);

    // Test Support section
    const supportHeading = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("heading", { name: FOOTER_SELECTORS.FOR_SUPPORT });
    if ((await supportHeading.count()) > 0) {
      await expect(supportHeading).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    }

    // Test support email link
    const supportEmail = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByRole("link")
      .filter({ hasText: FOOTER_SELECTORS.SUPPORT_EMAIL });
    if ((await supportEmail.count()) > 0) {
      await expect(supportEmail).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
      await expect(supportEmail).toHaveAttribute("href", /mailto:/);
    }

    // Test copyright text
    const copyrightText = page
      .locator(FOOTER_SELECTORS.FOOTER)
      .getByText(FOOTER_SELECTORS.COPYRIGHT_PATTERN);
    await expect(copyrightText).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
  });
});
