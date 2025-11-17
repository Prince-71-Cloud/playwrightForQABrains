# QA Brains Playwright Tests with Allure Reporting

This repository contains Playwright tests with Allure reporting integration.

## Setup

To run the tests locally with Allure reporting, you'll need to:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

- Run all tests (with Allure reports):

  ```bash
  npm run test:allure
  ```

- Generate Allure reports after running tests:

  ```bash
  npm run allure:generate
  ```

- Open Allure report in browser:
  ```bash
  npm run allure:open
  ```

## GitHub Actions Integration

The workflow in `.github/workflows/playwright-tests.yml` will:

1. Run Playwright tests
2. Generate Allure report only when all tests pass successfully
3. Archive the report as an artifact for download
