# QABrains - Playwright Testing Setup

This project includes Playwright for end-to-end testing of web applications.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

- Run all tests:
  ```bash
  npm test
  ```

- Run tests in UI mode:
  ```bash
  npm run test:ui
  ```

- Run tests in debug mode:
  ```bash
  npm run test:debug
  ```

- Run tests on a specific browser:
  ```bash
  npx playwright test --project=chromium
  ```

## Creating Tests

Tests are located in the `tests/` directory. Each test file should end with `.spec.js` or `.spec.ts`.

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [API Reference](https://playwright.dev/docs/api/class-test)
