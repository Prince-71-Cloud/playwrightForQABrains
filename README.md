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
- [Allure Test Reports](https://docs.qameta.io/allure/)

## CI/CD with Allure Reports

The GitHub Actions workflow automatically:
- Runs Playwright tests on push/PR
- Generates Allure reports
- Emails the report to bhuiyanaman71@gmail.com

To enable email functionality, set these repository secrets:
- `EMAIL_USERNAME`: Your email address
- `EMAIL_PASSWORD`: Your email password (or app password for Gmail)

## Running Tests with Allure Reports

- Run tests with Allure reporting:
  ```bash
  npm run test:allure
  ```

- Generate Allure report:
  ```bash
  npm run allure:generate
  ```

- Open Allure report in browser:
  ```bash
  npm run allure:open
  ```
