import { test, expect, Page } from "@playwright/test";

// Constants
const BASE_URL = "https://practice.qabrains.com";
const VALID_USER = {
  name: "Aman Bhuiyan",
  country: "Bangladesh",
  accountType: "Engineer",
  email: "aman.bhuiyan@example.com",
  password: "You123",
  confirmPassword: "You123",
};

const warningMessages = {
  name_required: "Name is a required field",
  country_required: "Country is a required field",
  account_type_required: "Account is a required field",
  email_invalid: "Email is a required field",
  password_weak: "Password is a required field",
  password_mismatch: "Passwords must match",
  weak_password: "Password must be at least 6 characters",
};

// Increased timeouts for CI/CD environments
const TIMEOUTS = {
  DEFAULT: 30000, // Increased from 10s to 30s
  PAGE_LOAD: 60000, // Increased from 30s to 60s
  TEST_TOTAL: 300000, // Increased from 120s to 300s
  ELEMENT_WAIT: 15000, // New timeout for element interactions
};

test.describe("User Registration Test Suite", () => {
  test.setTimeout(TIMEOUTS.TEST_TOTAL);

  // Setup before each test
  async function navigateToRegistrationPage(page: Page): Promise<void> {
    await page.goto(BASE_URL, { timeout: TIMEOUTS.PAGE_LOAD });
    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Wait for and click Registration link
    const registrationLink = page.getByText("Registration");
    await registrationLink.waitFor({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await registrationLink.click({ timeout: TIMEOUTS.ELEMENT_WAIT });

    // Wait for the registration form to load
    await expect(
      page.getByRole("heading", { name: "User Authentication" })
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
  }

  test("Valid Registration - Successful user registration with valid credentials", async ({
    page,
  }) => {
    await navigateToRegistrationPage(page);

    // Fill registration form with valid data, with explicit waits
    const nameField = page.getByRole("textbox", { name: "Name*" });
    await nameField.waitFor({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await nameField.fill(VALID_USER.name);

    const countrySelect = page.getByLabel("Select Country*");
    await expect(countrySelect).toBeVisible();
    await countrySelect.selectOption(VALID_USER.country);

    const accountTypeSelect = page.getByLabel("Account Type*");
    await expect(accountTypeSelect).toBeVisible();
    await accountTypeSelect.selectOption(VALID_USER.accountType);

    const emailField = page.getByRole("textbox", { name: "Email*" });
    await expect(emailField).toBeVisible();
    await emailField.fill(VALID_USER.email);

    const passwordField = page.getByRole("textbox", {
      name: "Password*",
      exact: true,
    });
    await expect(passwordField).toBeVisible();
    await passwordField.fill(VALID_USER.password);

    const confirmPasswordField = page.getByRole("textbox", {
      name: "Confirm Password*",
    });
    await expect(confirmPasswordField).toBeVisible();
    await confirmPasswordField.fill(VALID_USER.confirmPassword);

    // Click signup button
    const signupButton = page.getByRole("button", { name: "SIGNUP" });
    await expect(signupButton).toBeVisible();
    await signupButton.click();

    // Wait for network idle to ensure all async operations complete
    await page.waitForLoadState("networkidle");

    // Verify successful registration
    await expect(
      page.getByRole("heading", { name: "Registration Successful" })
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
  });

  test("Invalid Registration - Name field validation", async ({ page }) => {
    await navigateToRegistrationPage(page);

    // Leave name field empty and try to proceed
    const nameField = page.getByRole("textbox", { name: "Name*" });
    await nameField.waitFor({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await nameField.fill("");

    const countrySelect = page.getByLabel("Select Country*");
    await expect(countrySelect).toBeVisible();
    await countrySelect.selectOption(VALID_USER.country);

    const accountTypeSelect = page.getByLabel("Account Type*");
    await expect(accountTypeSelect).toBeVisible();
    await accountTypeSelect.selectOption(VALID_USER.accountType);

    const emailField = page.getByRole("textbox", { name: "Email*" });
    await expect(emailField).toBeVisible();
    await emailField.fill(VALID_USER.email);

    const passwordField = page.getByRole("textbox", {
      name: "Password*",
      exact: true,
    });
    await expect(passwordField).toBeVisible();
    await passwordField.fill(VALID_USER.password);

    // Check if there's a validation error for name field
    const signupButton = page.getByRole("button", { name: "SIGNUP" });
    await expect(signupButton).toBeVisible();
    await signupButton.click();

    // Wait for validation errors to appear
    await page.waitForTimeout(2000);

    // Verify the expected error message appears
    await expect(page.getByText(warningMessages.name_required)).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_WAIT,
    });
  });

  test("Invalid Registration - Email format validation", async ({ page }) => {
    await navigateToRegistrationPage(page);

    // Fill with invalid email format
    const nameField = page.getByRole("textbox", { name: "Name*" });
    await nameField.waitFor({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await nameField.fill(VALID_USER.name);

    const countrySelect = page.getByLabel("Select Country*");
    await expect(countrySelect).toBeVisible();
    await countrySelect.selectOption(VALID_USER.country);

    const accountTypeSelect = page.getByLabel("Account Type*");
    await expect(accountTypeSelect).toBeVisible();
    await accountTypeSelect.selectOption(VALID_USER.accountType);

    const emailField = page.getByRole("textbox", { name: "Email*" });
    await expect(emailField).toBeVisible();
    await emailField.fill("invalid-email-format");

    const passwordField = page.getByRole("textbox", {
      name: "Password*",
      exact: true,
    });
    await expect(passwordField).toBeVisible();
    await passwordField.fill(VALID_USER.password);

    // Click signup button to trigger validation
    const signupButton = page.getByRole("button", { name: "SIGNUP" });
    await expect(signupButton).toBeVisible();
    await signupButton.click();

    // Wait for potential validation errors to appear
    await page.waitForTimeout(2000);

    // Verify registration was not successful
    await expect(
      page.getByRole("heading", { name: "Registration Successful" })
    ).not.toBeVisible();
  });

  test("Invalid Registration - Password validation", async ({ page }) => {
    await navigateToRegistrationPage(page);

    // Fill with weak password
    const nameField = page.getByRole("textbox", { name: "Name*" });
    await nameField.waitFor({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await nameField.fill(VALID_USER.name);

    const countrySelect = page.getByLabel("Select Country*");
    await expect(countrySelect).toBeVisible();
    await countrySelect.selectOption(VALID_USER.country);

    const accountTypeSelect = page.getByLabel("Account Type*");
    await expect(accountTypeSelect).toBeVisible();
    await accountTypeSelect.selectOption(VALID_USER.accountType);

    const emailField = page.getByRole("textbox", { name: "Email*" });
    await expect(emailField).toBeVisible();
    await emailField.fill(VALID_USER.email);

    const passwordField = page.getByRole("textbox", {
      name: "Password*",
      exact: true,
    });
    await expect(passwordField).toBeVisible();
    await passwordField.fill("weak");

    // Click signup button to trigger validation
    const signupButton = page.getByRole("button", { name: "SIGNUP" });
    await expect(signupButton).toBeVisible();
    await signupButton.click();

    // Wait for potential validation errors to appear
    await page.waitForTimeout(2000);

    // Check if there's a validation error for weak password
    await expect(page.getByText(warningMessages.weak_password)).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_WAIT,
    });
  });

  test("Invalid Registration - Password and Confirm Password mismatch", async ({
    page,
  }) => {
    await navigateToRegistrationPage(page);

    // Fill in form correctly until password confirmation
    const nameField = page.getByRole("textbox", { name: "Name*" });
    await expect(nameField).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await nameField.fill(VALID_USER.name);

    const countrySelect = page.getByLabel("Select Country*");
    await expect(countrySelect).toBeVisible();
    await countrySelect.selectOption(VALID_USER.country);

    const accountTypeSelect = page.getByLabel("Account Type*");
    await expect(accountTypeSelect).toBeVisible();
    await accountTypeSelect.selectOption(VALID_USER.accountType);

    const emailField = page.getByRole("textbox", { name: "Email*" });
    await expect(emailField).toBeVisible();
    await emailField.fill(VALID_USER.email);

    const passwordField = page.getByRole("textbox", {
      name: "Password*",
      exact: true,
    });
    await expect(passwordField).toBeVisible();
    await passwordField.fill(VALID_USER.password);

    // Enter different confirmation password
    const confirmPasswordField = page.getByRole("textbox", {
      name: "Confirm Password*",
    });
    await expect(confirmPasswordField).toBeVisible();
    await confirmPasswordField.fill("differentPassword");

    // Click signup button
    const signupButton = page.getByRole("button", { name: "SIGNUP" });
    await expect(signupButton).toBeVisible();
    await signupButton.click();

    // Wait for potential validation errors to appear
    await page.waitForTimeout(2000);

    // Verify error message for password mismatch
    await expect(page.getByText(warningMessages.password_mismatch)).toBeVisible(
      { timeout: TIMEOUTS.ELEMENT_WAIT }
    );
  });
});
