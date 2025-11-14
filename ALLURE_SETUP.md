

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
2. Generate Allure report
3. Email the report to bhuiyanaman71@gmail.com

## Required Secrets for Email Functionality

To enable the email feature, you need to set up these secrets in your GitHub repository:
- `EMAIL_USERNAME`: Your Gmail address (or other SMTP account)
- `EMAIL_PASSWORD`: Your Gmail app password (or SMTP password)

### Setting up Gmail for Email Reports

1. Use a Gmail account for sending the reports
2. Enable 2-factor authentication
3. Generate an App Password (not your regular Gmail password)
4. Add these secrets to your GitHub repository:
   - Go to repository Settings > Secrets and Variables > Actions
   - Add `EMAIL_USERNAME` and `EMAIL_PASSWORD` secrets

For other SMTP providers, adjust the server settings in the workflow file accordingly.