#!/bin/bash

# Jenkins-specific Playwright test runner
# This script handles common Jenkins environment issues

set -e  # Exit on any error

echo "==========================================="
echo "Starting Playwright tests in Jenkins..."
echo "Current directory: $(pwd)"
echo "User: $(whoami)"
echo "Node version: $(node --version 2>/dev/null || echo 'Node not found')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'NPM not found')"
echo "==========================================="

# Check if we have Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js or configure Jenkins to provide Node.js in PATH"
    exit 1
fi

# Check if we have npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    echo "Please install npm or configure Jenkins to provide npm in PATH"
    exit 1
fi

# Check if we're in the right directory with the project files
if [ ! -f "package.json" ] || [ ! -f "playwright.config.js" ]; then
  echo "ERROR: Required project files not found."
  echo "Current directory contents:"
  ls -la
  exit 1
fi

# Setup environment variables
export CI=true
export NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies
echo "Installing dependencies..."
npm ci --verbose

# Install Playwright browsers (Chrome only)
echo "Installing Playwright Chrome browser..."
npx playwright install chromium

# Check if system dependencies are available (without requiring root)
echo "Checking for system dependencies..."
if command -v ldd &> /dev/null; then
  if ! ldd $(which chromium-browser 2>/dev/null || which google-chrome 2>/dev/null || which firefox 2>/dev/null || echo "/dummy") >/dev/null 2>&1; then
    echo "System dependencies may be missing. Please ensure Playwright dependencies are pre-installed."
    echo "For Ubuntu: sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2"
  fi
fi

# Verify browser installation
echo "Verifying browser installations..."
npx playwright show-report --version 2>/dev/null || echo "Playwright installation completed"

# Create output directories
mkdir -p test-results
mkdir -p playwright-report
mkdir -p allure-results

# Run tests (Chrome only)
echo "Running Playwright Chrome tests with Allure reporter..."
ALLURE_ENABLED=true npx playwright test --project=chromium --reporter=line,html,json,allure-playwright --output=test-results/ --config=playwright.config.js

TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo "==========================================="
  echo "All tests completed successfully!"
  echo "==========================================="
else
  echo "==========================================="
  echo "Tests failed with exit code $TEST_EXIT_CODE"
  echo "==========================================="
  exit $TEST_EXIT_CODE
fi

# Generate HTML report if tests ran
if [ -d "playwright-report" ] && [ "$(ls -A playwright-report)" ]; then
  echo "HTML report available in playwright-report/ directory"
else
  echo "Generating HTML report from test results..."
  npx playwright show-report --output=playwright-report
fi

# Generate Allure report if Allure is available
if command -v allure &> /dev/null; then
  echo "Generating Allure report..."
  allure generate allure-results -o allure-report --clean
  echo "Allure report available in allure-report/ directory"
else
  echo "Allure command-line tool not found. Skipping Allure report generation."
  echo "To generate Allure reports, install Allure from https://github.com/allure-framework/allure2"
fi

echo "==========================================="
echo "Build completed. Results are available in test-results/, playwright-report/, and allure-report/ directories."
echo "==========================================="