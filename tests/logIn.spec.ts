import { test, expect, Page } from "@playwright/test";

// Constants
const BASE_URL = "https://practice.qabrains.com";
const VALID_CREDENTIALS = {
  email: "qa_testers@qabrains.com",
  password: "Password123",
};
const popUpMessage = {
  success: "Login Successful",
  failure_password: "Your password is invalid!",
  failure_email: "Your email is invalid!",
  failure_both: "Your email and password both are invalid!",
};

const emptyWarning = {
  email: "Email is a required field",
  password: "Password is a required field",
};
const TIMEOUTS = {
  DEFAULT: 10000,
  PAGE_LOAD: 30000,
  TEST_TOTAL: 120000,
};

test.describe("User Authentication Test Suite", () => {
  test.setTimeout(TIMEOUTS.TEST_TOTAL);

  // Setup before each test
  async function navigateToAuthPage(page: Page): Promise<void> {
    await page.goto(BASE_URL, { timeout: TIMEOUTS.PAGE_LOAD });
    // Use a more specific selector to avoid the strict mode violation
    // Look for the span inside #demo-module which should be unique
    const authLink = page.locator("#demo-module").locator("span:text('User Authentication')");
    await expect(authLink).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    await authLink.click({ timeout: TIMEOUTS.DEFAULT });
  }

  test("Valid Login - Successful authentication with correct credentials", async ({
    page,
  }) => {
    await navigateToAuthPage(page);

    // Fill in valid credentials
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_CREDENTIALS.email);
    await page
      .getByRole("textbox", { name: "Password*" })
      .fill(VALID_CREDENTIALS.password);
    await page.getByRole("button", { name: "Login" }).click();

    // Verify successful login
    await expect(
      page.locator("span").filter({ hasText: "Login Successful" })
    ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    await expect(
      page.getByText(
        "Login SuccessfulCongratulations. You have successfully logged in."
      )
    ).toBeVisible();
  });

  test("Valid Login - Successful authentication with email and password, verify redirect", async ({
    page,
  }) => {
    await navigateToAuthPage(page);

    // Fill in valid credentials
    await page.getByRole("textbox", { name: "Email*" }).click();
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_CREDENTIALS.email);
    await page.getByRole("textbox", { name: "Email*" }).press("Tab");
    await page
      .getByRole("textbox", { name: "Password*" })
      .fill(VALID_CREDENTIALS.password);
    await page.getByRole("button", { name: "Login" }).click();

    // Verify successful login message
    const successMessage = page
      .locator("span")
      .filter({ hasText: "Login Successful" });
    await expect(successMessage).toBeVisible({ timeout: TIMEOUTS.DEFAULT });

    // Additional verification
    await expect(
      page.getByText("Congratulations. You have successfully logged in.")
    ).toBeVisible();
  });

  test("Invalid Login - Wrong password should show error", async ({ page }) => {
    await navigateToAuthPage(page);

    // Fill in correct email but wrong password
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_CREDENTIALS.email);
    await page
      .getByRole("textbox", { name: "Password*" })
      .fill("WrongPassword123");
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error message is shown
    await expect(page.getByText(popUpMessage.failure_password)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(
      page.locator("span").filter({ hasText: popUpMessage.success })
    ).not.toBeVisible();
  });

  test("Invalid Login - Wrong email should show error", async ({ page }) => {
    await navigateToAuthPage(page);

    // Fill in wrong email but correct password
    await page.getByRole("textbox", { name: "Email*" }).fill("wrong@email.com");
    await page
      .getByRole("textbox", { name: "Password*" })
      .fill(VALID_CREDENTIALS.password);
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error message is shown
    await expect(page.getByText(popUpMessage.failure_email)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(
      page.locator("span").filter({ hasText: popUpMessage.success })
    ).not.toBeVisible();
  });

  test("Invalid Login - Both wrong email and password should show error", async ({
    page,
  }) => {
    await navigateToAuthPage(page);

    // Fill in wrong email and wrong password
    await page.getByRole("textbox", { name: "Email*" }).fill("wrong@email.com");
    await page
      .getByRole("textbox", { name: "Password*" })
      .fill("WrongPassword123");
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error message is shown
    await expect(page.getByText(popUpMessage.failure_both)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(
      page.locator("span").filter({ hasText: popUpMessage.success })
    ).not.toBeVisible();
  });

  test("Invalid Login - Empty email field should show validation error", async ({
    page,
  }) => {
    await navigateToAuthPage(page);

    // Fill in empty email and valid password
    await page.getByRole("textbox", { name: "Email*" }).fill("");
    await page
      .getByRole("textbox", { name: "Password*" })
      .fill(VALID_CREDENTIALS.password);
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error or validation message is shown
    await expect(page.getByText(emptyWarning.email)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(
      page.locator("span").filter({ hasText: popUpMessage.success })
    ).not.toBeVisible();
  });

  test("Invalid Login - Empty password field should show validation error", async ({
    page,
  }) => {
    await navigateToAuthPage(page);

    // Fill in valid email and empty password
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_CREDENTIALS.email);
    await page.getByRole("textbox", { name: "Password*" }).fill("");
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error or validation message is shown
    await expect(page.getByText(emptyWarning.password)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(
      page.locator("span").filter({ hasText: popUpMessage.success })
    ).not.toBeVisible();
  });

  test("Invalid Login - Both empty fields should show validation errors", async ({
    page,
  }) => {
    await navigateToAuthPage(page);

    // Fill in empty email and empty password
    await page.getByRole("textbox", { name: "Email*" }).fill("");
    await page.getByRole("textbox", { name: "Password*" }).fill("");
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error or validation message is shown
    await expect(page.getByText(emptyWarning.email)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(page.getByText(emptyWarning.password)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(
      page.locator("span").filter({ hasText: popUpMessage.success })
    ).not.toBeVisible();
  });

  // test("Invalid Login - Invalid email format should show validation error", async ({
  //   page,
  // }) => {
  //   await navigateToAuthPage(page);

  //   // Fill in invalid email format and valid password
  //   await page.getByRole("textbox", { name: "Email*" }).fill("invalid-email");
  //   await page
  //     .getByRole("textbox", { name: "Password*" })
  //     .fill(VALID_CREDENTIALS.password);
  //   await page.getByRole("button", { name: "Login" }).click();

  //   // Verify error or validation message is shown
  //   await expect(page.getByText(popUpMessage.failure_email)).toBeVisible({
  //     timeout: TIMEOUTS.DEFAULT,
  //   });
  //   await expect(
  //     page.locator("span").filter({ hasText: popUpMessage.success })
  //   ).not.toBeVisible();
  // });

  test("Invalid Login - Special characters in password should be handled properly", async ({
    page,
  }) => {
    await navigateToAuthPage(page);

    // Fill in valid email and password with special characters that don't meet requirements
    await page
      .getByRole("textbox", { name: "Email*" })
      .fill(VALID_CREDENTIALS.email);
    await page.getByRole("textbox", { name: "Password*" }).fill("!@#$%^&*()");
    await page.getByRole("button", { name: "Login" }).click();

    // Verify error message is shown for invalid password
    await expect(page.getByText(popUpMessage.failure_password)).toBeVisible({
      timeout: TIMEOUTS.DEFAULT,
    });
    await expect(
      page.locator("span").filter({ hasText: popUpMessage.success })
    ).not.toBeVisible();
  });
});
