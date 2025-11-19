#!/bin/bash

# Script to run Playwright tests in Jenkins
set -e  # Exit on any error

echo "Starting Playwright tests in Jenkins..."

# Setup
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
echo "Installing dependencies..."
npm ci

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install --with-deps

# Create output directories
mkdir -p test-results
mkdir -p playwright-report

# Run tests
echo "Running Playwright tests..."
if [ "$BROWSER" ]; then
    echo "Running tests for browser: $BROWSER"
    npx playwright test --project="$BROWSER" --reporter=line,json --output=test-results/
else
    echo "Running tests for all browsers..."
    npx playwright test --reporter=line,json --output=test-results/
fi

# Generate report
echo "Generating HTML report..."
npx playwright show-report

echo "Tests completed. Results are available in test-results/ and playwright-report/ directories."