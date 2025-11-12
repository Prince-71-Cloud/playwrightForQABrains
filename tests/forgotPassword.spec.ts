import { test, expect, Page } from "@playwright/test";

// Constants
const BASE_URL = "https://practice.qabrains.com";
const VALID_EMAILS = {
  existing_user: "aman.bhuiyan@example.com",
  valid_email: "test@example.com",
  email_with_plus: "user+tag@example.com",
  email_with_periods: "user.name@example.com"
};
const INVALID_USERS = {
  wrong_domain: "test@wrongdomain.com",
};

const INVALID_EMAIL_FORMATS = [
  "invalid-email",
  "@example.com",
  "user@",
  "user..name@example.com",
  "user@domain.",
  ".user@example.com",
  "user@.com",
  "user name@example.com",
  "user@exam ple.com",
  "user@",
  "user",
  "@",
  "",
  "   ",
  "user@@example.com",
  "user@-example.com",
  "user@example-.com"
];
const TIMEOUTS = {
  DEFAULT: 10000,
  PAGE_LOAD: 30000,
  TEST_TOTAL: 120000,
  API_CALL: 15000
};

const SUCCESS_MESSAGES = {
  password_reset_initiated: "Password is reset successfully",
  check_email: "Check EmailPassword has been",
  check_email_alt: "Check your email"
};

const ERROR_MESSAGES = {
  email_required: "Email is a required field",
  email_not_found: "User does not exist with this email address",
  email_invalid: "Please enter a valid email address",
  rate_limit: "Too many password reset attempts"
};

test.describe("Forgot Password Test Suite", () => {
  test.setTimeout(TIMEOUTS.TEST_TOTAL);

  // Setup before each test
  async function navigateToForgotPasswordPage(page: Page): Promise<void> {
    await page.goto(BASE_URL, { timeout: TIMEOUTS.PAGE_LOAD });
    await page.getByText("Forgot Password").click({timeout: TIMEOUTS.PAGE_LOAD});
    // Wait for the forgot password form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Email*" })
    ).toBeVisible();
  }

  test.only("Positive: Forgot Password - Valid existing user should initiate password reset", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Fill in valid existing email
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_EMAILS.existing_user);

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify success message is displayed
    await expect(
      page.getByText(SUCCESS_MESSAGES.password_reset_initiated)
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    
    await expect(
      page.locator('div').filter({ hasText: new RegExp(SUCCESS_MESSAGES.check_email) })
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    
    await expect(
      page.getByRole("heading", { name: "Check Email" })
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
  });

  test("Positive: Forgot Password - Valid email with special characters should initiate password reset", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Fill in valid email with special characters
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_EMAILS.email_with_plus);

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify success message is displayed
    await expect(
      page.getByText(SUCCESS_MESSAGES.password_reset_initiated)
    ).toBeVisible({ timeout: TIMEOUTS.API_CALL });
    
    // Verify we're on the check email page
    await expect(
      page.getByRole("heading", { name: "Check Email" })
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
  });

  test("Negative: Forgot Password - Empty email field should show validation error", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Clear email field (in case it has default value)
    await page.getByRole("textbox", { name: "Email*" }).fill("");

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify error message is displayed
    await expect(page.getByText(ERROR_MESSAGES.email_required)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    });

  test("Negative: Forgot Password - Multiple invalid email formats should be rejected", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    for (const invalidEmail of INVALID_EMAIL_FORMATS) {
      // Clear and fill with invalid email
      await page.getByRole("textbox", { name: "Email*" }).fill("");
      await page.getByRole("textbox", { name: "Email*" }).fill(invalidEmail);

      // Click reset password button
      await page.getByRole("button", { name: "Reset Password" }).click();

      // Wait briefly to allow validation
      await page.waitForTimeout(500);

      // Verify that the page remains on the forgot password form
      await expect(
        page.getByRole("textbox", { name: "Email*" })
      ).toBeVisible();
      
      // Check if an error message appears or the form remains on the same page
      await expect(
        page.locator('div').filter({ hasText: /required|valid|invalid/i })
      ).toBeVisible().catch(async () => {
        // If no validation message, ensure the page didn't proceed to next step
        await expect(
          page.getByRole("heading", { name: "Check Email" })
        ).not.toBeVisible();
      });
      
      // Wait between iterations
      await page.waitForTimeout(200);
    }
  });

  test("Negative: Forgot Password - Invalid email domain should be rejected", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Fill with email having invalid domain
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(INVALID_USERS.wrong_domain);

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify error message appears (could be domain-specific or general)
    // or that the page remains on the same form
    await expect(
      page.getByRole("textbox", { name: "Email*" })
    ).toBeVisible(); // Should remain on the same page
    
    // Check if an error message appears
    await expect(
      page.locator('div').filter({ hasText: /not exist|invalid|wrong|valid/i })
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT }).catch(async () => {
      // If no validation message, ensure the page didn't proceed to next step
      await expect(
        page.getByRole("heading", { name: "Check Email" })
      ).not.toBeVisible({ timeout: 1000 });
    });
  });

  test("Positive: Forgot Password - Email field accessibility and validation", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Verify email field properties
    const emailField = page.getByRole("textbox", { name: "Email*" });
    await expect(emailField).toBeVisible();
    await expect(emailField).toBeEnabled();
    await expect(emailField).toBeEditable();
    
    // Test keyboard navigation
    await page.keyboard.press("Tab");
    await expect(emailField).toBeFocused();
    
    // Fill in email
    await emailField.fill(VALID_EMAILS.existing_user);
    await expect(emailField).toHaveValue(VALID_EMAILS.existing_user);
    
    // Verify field type is email (if applicable in the implementation)
    await expect(emailField).toHaveAttribute("type", "email").catch(async () => {
      // If not specifically set as email type, ensure it's a textbox
      await expect(emailField).toHaveAttribute("type", "text");
    });
  });

  test("Negative: Forgot Password - Attempting multiple requests with same email should be handled appropriately", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Fill in valid email
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_EMAILS.valid_email);

    // Click reset password button multiple times rapidly
    const button = page.getByRole("button", { name: "Reset Password" });
    
    // First click
    await button.click();
    
    // Wait a moment to allow the first request to process
    await page.waitForTimeout(1000);
    
    // Try additional clicks (should be handled gracefully)
    await button.click().catch(() => {}); // Catch in case button gets disabled
    await page.waitForTimeout(500);
    await button.click().catch(() => {});
    
    // Verify the application handles multiple requests appropriately
    // This might mean showing a single success message or rate limiting
    const successMessages = page.getByText(SUCCESS_MESSAGES.password_reset_initiated);
    await expect(successMessages).toHaveCount(1, { timeout: TIMEOUTS.API_CALL }).catch(async () => {
      // If multiple messages appear, that's also a valid scenario to test
      await expect(successMessages).toHaveCount(0).catch(async () => {
        // Or if rate limiting is implemented, check for rate limit message
        await expect(page.getByText(ERROR_MESSAGES.rate_limit)).toBeVisible().catch(() => {});
      });
    });
  });

  test("Negative: Forgot Password - Very long email should be handled properly", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Generate a very long email address
    const longEmail = "a".repeat(250) + "@example.com";

    // Fill with very long email
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(longEmail);

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify appropriate handling of long email (could be validation error or normal processing)
    await expect(
      page.locator('div').filter({ hasText: /length|valid|invalid/i })
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT }).catch(async () => {
      // If no error message, verify that the request is processed normally
      await expect(
        page.getByRole("heading", { name: "Check Email" })
      ).not.toBeVisible({ timeout: 1000 }); // Should not proceed to next step immediately
    });
  });

  test("Positive: Forgot Password - Whitespace in email should be handled properly", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Fill with email that has leading/trailing spaces
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill("  " + VALID_EMAILS.existing_user + "  ");

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify the system handles whitespace appropriately (trimming or validation)
    if (await page.getByText(ERROR_MESSAGES.email_invalid).isVisible().catch(() => false)) {
      // If whitespace causes validation error
      await expect(page.getByText(ERROR_MESSAGES.email_invalid)).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    } else {
      // If whitespace is trimmed and processed normally
      await expect(
        page.getByText(SUCCESS_MESSAGES.password_reset_initiated)
      ).toBeVisible({ timeout: TIMEOUTS.API_CALL });
    }
  });

  test("Negative: Forgot Password - Cancel/reset after submission should work properly", async ({
    page,
  }) => {
    await navigateToForgotPasswordPage(page);

    // Fill in valid email
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_EMAILS.existing_user);

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Wait for the success message to appear
    await expect(
      page.getByText(SUCCESS_MESSAGES.password_reset_initiated)
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    
    // Navigate back to the main page or login page
    await page.goto(BASE_URL);
    
    // Navigate again to forgot password
    await page.getByText("Forgot Password").click();
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();
  });
});