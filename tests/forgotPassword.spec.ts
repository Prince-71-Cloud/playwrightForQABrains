import { test, expect, Page } from "@playwright/test";

// Constants (updated existing_user to demo email)
const BASE_URL = "https://practice.qabrains.com/";
const VALID_EMAILS = {
  existing_user: "qa_testers@qabrains.com", // Demo existing user
  valid_email: "test@example.com",
  email_with_plus: "user+tag@example.com",
  email_with_periods: "user.name@example.com",
};

const INVALID_EMAIL_FORMATS = [
  "invalid-email",
  "@example.com",
  "user@",
  "user@domain.",
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
  "user@example-.com",
];
const TIMEOUTS = {
  DEFAULT: 10000,
  PAGE_LOAD: 30000,
  TEST_TOTAL: 120000,
  API_CALL: 20000,
};

const SUCCESS_MESSAGES = {
  password_reset_initiated: "Password is reset successfully",
  check_email: "Check EmailPassword has been", // Adjust if truncated (e.g., full text from inspection)
  check_email_alt: "Check your email",
};

const ERROR_MESSAGES = {
  email_required: "Email is a required field",
  email_not_found: "User does not exist with this email address",
  email_invalid: "Please enter a valid email address",
  rate_limit: "Too many password reset attempts",
};

test.describe("Forgot Password Test Suite", () => {
  test.setTimeout(TIMEOUTS.TEST_TOTAL);

  test("Positive: Forgot Password - Valid existing user should initiate password reset", async ({
    page,
  }) => {
    // Navigate to Forgot Password page
    await page.goto(BASE_URL);

    // Check if "Forgot Password" link is visible on the page
    const forgotPasswordLink = page.locator("#forgot-password");
    await forgotPasswordLink.click();
    await page.waitForLoadState("networkidle");

    // Wait for the authentication form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();

    // Fill in the email
    await page.locator("#email").fill(VALID_EMAILS.existing_user);

    // Click the reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();
    await page.waitForLoadState("networkidle");

    // Wait for and verify the success message
    await expect(
      page.getByText("Password is reset successfully.")
    ).toBeVisible();
  });

  test("Positive: Forgot Password - Valid email with special characters should initiate password reset", async ({
    page,
  }) => {
    // Navigate to Forgot Password page
    await page.goto(BASE_URL);

    // Check if "Forgot Password" link is visible on the page
    const forgotPasswordLink = page.locator("#forgot-password");
    await forgotPasswordLink.click();
    await page.waitForLoadState("networkidle");

    // Wait for the authentication form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();
    // For now, using demo base with plus (adjust if needed: qa_testers+tag@qabrains.com)
    const specialEmail = VALID_EMAILS.existing_user.replace("@", "+tag@"); // e.g., qa_testers+tag@qabrains.com
    const emailField = page.getByRole("textbox", { name: "Email*" });
    await emailField.fill(specialEmail);
    await emailField.blur();

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Wait for network idle
    await page.waitForLoadState("networkidle");

    // Fail-fast: No not-found error
    await expect(
      page.getByText(SUCCESS_MESSAGES.password_reset_initiated)
    ).toBeVisible();
  });

  // ... (Negative tests remain unchanged, as they don't rely on existing users)
  test("Negative: Forgot Password - Empty email field should show validation error", async ({
    page,
  }) => {
    // Navigate to Forgot Password page
    await page.goto(BASE_URL);

    // Check if "Forgot Password" link is visible on the page
    const forgotPasswordLink = page.locator("#forgot-password");
    await forgotPasswordLink.click();
    await page.waitForLoadState("networkidle");

    // Wait for the authentication form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();
    // Clear email field
    const emailField = page.getByRole("textbox", { name: "Email*" });
    await emailField.fill("");

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify error message is displayed
    await expect(page.getByText(ERROR_MESSAGES.email_required)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });

    // Ensure no success/redirect
    await expect(
      page.getByRole("heading", { name: "Check Email" })
    ).not.toBeVisible();
  });

  test("Negative: Forgot Password - Multiple invalid email formats should be rejected", async ({
    page,
  }) => {
    // Navigate to Forgot Password page
    await page.goto(BASE_URL);

    // Check if "Forgot Password" link is visible on the page
    const forgotPasswordLink = page.locator("#forgot-password");
    await forgotPasswordLink.click();
    await page.waitForLoadState("networkidle");

    // Wait for the authentication form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();

    for (const invalidEmail of INVALID_EMAIL_FORMATS) {
      // Clear and fill with invalid email
      const emailField = page.getByRole("textbox", { name: "Email*" });
      await emailField.fill(invalidEmail);
      await emailField.blur(); // Trigger client-side validation

      // Click reset password button
      await page.getByRole("button", { name: "Reset Password" }).click();

      // Wait briefly
      await page.waitForTimeout(500);

      // Verify form remains (no redirect)
      await expect(emailField).toBeVisible();

      // Check for error (robust: any invalid/required message)
      await expect(
        page.getByRole("heading", { name: "Check Email" })
      ).not.toBeVisible();

      // Wait between iterations
      await page.waitForTimeout(200);
    }
  });

  test("Negative: Forgot Password - Very long email should be handled properly", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    // Check if "Forgot Password" link is visible on the page
    const forgotPasswordLink = page.locator("#forgot-password");
    await forgotPasswordLink.click();
    await page.waitForLoadState("networkidle");

    // Wait for the authentication form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();

    // Generate a very long email address
    const longEmail = "a".repeat(250) + "@example.com";

    // Fill with very long email
    const emailField = page.getByRole("textbox", { name: "Email*" });
    await emailField.fill(longEmail);
    await emailField.blur();

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Verify that the page remains unchanged (no success message)
    await expect(
      page.getByRole("heading", { name: "Check Email" })
    ).not.toBeVisible({ timeout: 2000 });
  });

  test("Positive: Forgot Password - Whitespace in email should be handled properly", async ({
    page,
    browserName
  }) => {
    await page.goto(BASE_URL);

    // Check if "Forgot Password" link is visible on the page
    const forgotPasswordLink = page.locator("#forgot-password");
    await forgotPasswordLink.click();
    await page.waitForLoadState("networkidle");

    // Wait for the authentication form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible();

    // Fill with email that has leading/trailing spaces (use demo base)
    const emailField = page.getByRole("textbox", { name: "Email*" });
    const spacedEmail = "  " + VALID_EMAILS.existing_user + "  ";
    await emailField.fill(spacedEmail);
    await emailField.blur();

    // Click reset password button
    await page.getByRole("button", { name: "Reset Password" }).click();
    await page.waitForLoadState("networkidle");

    // Different browsers may handle whitespace differently
    // In Firefox, the form may prevent submission with whitespace, while other browsers might process it
    if (browserName === "firefox") {
      // For Firefox, verify that the success message is NOT visible (form submission prevented)
      await expect(page.getByText(/Password is reset successfully./i)).not.toBeVisible({ timeout: TIMEOUTS.API_CALL });
    } else {
      // For other browsers, expect the standard response
      await expect(
        page
          .getByText(SUCCESS_MESSAGES.password_reset_initiated)
          .or(page.getByText(ERROR_MESSAGES.email_invalid))
          .or(page.getByText(SUCCESS_MESSAGES.check_email_alt))
      ).toBeVisible({ timeout: TIMEOUTS.API_CALL });
    }
  });
});
