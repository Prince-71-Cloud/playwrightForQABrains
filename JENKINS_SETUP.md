# Jenkins Setup for Playwright Project

This document explains how to set up and run your Playwright tests in Jenkins.

## Prerequisites

1. Jenkins server with the following plugins installed:
   - Pipeline plugin
   - NodeJS plugin
   - HTML Publisher plugin (for reports)
   - Docker plugin (optional, but recommended for consistency)

2. Linux agents (recommended for headless browser testing)

## Node.js Installation

1. Install NodeJS plugin in Jenkins
2. Go to Manage Jenkins > Global Tool Configuration
3. Add a NodeJS installation named "NodeJS 18" (or similar) that points to Node.js version 18+

## Jenkins Pipeline Configuration

### Option 1: Using the Jenkinsfile (Recommended)

1. Create a new Pipeline job in Jenkins
2. In the Pipeline configuration:
   - Set Definition to "Pipeline script from SCM"
   - Choose your SCM (Git) and repository URL
   - Set Script Path to `Jenkinsfile`

### Option 2: Using Pipeline Script

For a simple setup without SCM, you can paste the Jenkinsfile content directly into the Pipeline script section.

## Environment Variables and Secrets

If your tests require environment variables or secrets (like API keys, database credentials), you should configure them as follows:

1. Use Jenkins Credentials Store to store sensitive information
2. Add environment variables in your Jenkins job configuration or in the environment block of your pipeline
3. In the Jenkinsfile, you can reference credentials like this:

```groovy
environment {
    BASE_URL = 'https://your-test-environment.com'
    API_KEY = credentials('api-key-credential-id')
    DB_PASSWORD = credentials('db-password-credential-id')
}
```

## Docker-based Jenkins Setup (Alternative)

For better consistency and browser compatibility, you can run your tests in Docker. Create a Dockerfile:

```Dockerfile
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
```

## Additional Jenkins Plugins That May Be Helpful

- Blue Ocean: For better pipeline visualization
- Timestamper: To add timestamps to console output
- Build Timeout: To automatically terminate hanging builds
- Workspace Cleanup: To clean up workspace between builds

## Running the Pipeline

Once configured, your Jenkins pipeline will:
1. Checkout your code
2. Install Node.js dependencies
3. Install Playwright browsers
4. Run tests in parallel across different browsers
5. Generate test reports
6. Archive artifacts for later analysis

## Troubleshooting

### Common Issues:

1. **Browser Installation**: Make sure Playwright browsers are installed correctly
2. **Display Issues**: For headless environments, ensure no display is needed
3. **Permissions**: Make sure Jenkins has permissions to run the tests
4. **Disk Space**: Playwright browsers take up space; monitor disk usage

### Debugging Tips:

- Enable debug logging if tests fail
- Check browser installation logs
- Verify network connectivity to test URLs
- Ensure sufficient memory allocation for browser processes