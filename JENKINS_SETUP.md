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

## Jenkins Project Configuration

### Option 1: Free-Style Project (Recommended for beginners)

1. Create a new Free-Style project in Jenkins
2. Configure Source Code Management:
   - Select Git
   - Enter your repository URL
   - Add credentials if needed
3. In Build Environment, check "Provide Node & npm bin/ folder to PATH"
4. In Build Steps, add "Execute shell" (or "Execute Windows batch command" on Windows):
   - Command: `./run-playwright-tests.sh`
5. Add Post-build Actions:
   - Publish HTML Reports
     - HTML Directory: `playwright-report`
     - Index Page: `index.html`
   - Archive Artifacts: `test-results/**/*,playwright-report/**/*`

### Option 2: Pipeline Job

#### Using the Jenkinsfile (Recommended for advanced users)

1. Create a new Pipeline job in Jenkins
2. In the Pipeline configuration:
   - Set Definition to "Pipeline script from SCM"
   - Choose your SCM (Git) and repository URL
   - Set Script Path to `Jenkinsfile`

#### Using Pipeline Script

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

## Additional Jenkins Configuration

### Node.js and Browser Dependencies

On your Jenkins agent/master, ensure you have:

1. Node.js 18+ installed
2. For Linux agents, install required system dependencies:
   ```bash
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg sudo
   # For Chromium
   sudo apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm-dev libxcomposite-dev libxdamage-dev libxrandr-dev libgbm-dev libxss-dev libasound2-dev
   # For Firefox
   sudo apt-get install -y libgtk-3-dev libglib2.0-dev
   # For WebKit
   sudo apt-get install -y libgstreamer-plugins-base1.0-dev libwayland-dev libxkbcommon-dev
   ```

### Required Jenkins Plugins

- NodeJS Plugin: For Node.js tool management
- HTML Publisher Plugin: To publish test reports
- Workspace Cleanup Plugin: For workspace management
- Timestamper: For better log output
- Build Timeout: To prevent hanging builds

### Security Considerations

- Restrict agent access to necessary permissions only
- Use credential store for sensitive data
- Enable Node usage limits to prevent resource exhaustion
- Configure proper file system permissions for Jenkins user

## Running the Project

Once configured, your Jenkins free-style project will:
1. Checkout your code
2. Install Node.js dependencies
3. Install Playwright browsers
4. Run tests across different browsers
5. Generate test reports
6. Archive artifacts for later analysis

## Troubleshooting

### Common Issues:

1. **Git Installation Error**: "Selected Git installation does not exist"
   - Go to Manage Jenkins > Global Tool Configuration
   - Under Git, add Git installation and specify git executable path
   - Common paths: `/usr/bin/git` (Linux), `git` (Windows with Git in PATH)

2. **Node.js Not Found**
   - Install NodeJS plugin in Jenkins
   - Go to Global Tool Configuration
   - Add NodeJS installation
   - In your project configuration, under "Build Environment", check "Provide Node & npm bin/ folder to PATH"
   - Alternative: Install Node.js directly on the Jenkins agent/server:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

3. **Browser Installation Issues**
   - Make sure you install Playwright with dependencies: `npx playwright install --with-deps`
   - On Linux, install required system dependencies (see Dependencies section above)

4. **Display Issues**: For headless environments, ensure no display is needed
   - All Playwright tests run in headless mode by default in CI environments

5. **Permissions**: Make sure Jenkins has permissions to run the tests
   - Check file permissions on the Jenkins workspace
   - Ensure Jenkins user can execute shell commands

6. **Disk Space**: Playwright browsers take up space; monitor disk usage
   - Chromium alone can take 100MB+ of space

7. **Memory Issues**
   - Increase memory for Node.js with NODE_OPTIONS environment variable
   - Consider limiting parallel workers in Playwright config if memory is limited

### Jenkins-Specific Debugging

1. Check the Jenkins console output for specific error messages
2. Verify that Jenkins has access to npm and node executables
3. Make sure the workspace directory has sufficient permissions and space
4. If using Docker agents, ensure the Docker image has all required dependencies

### Workspace Setup for Your Project

Since your Jenkins workspace is at `/var/lib/jenkins/workspace/Playwright Automation QABrains` (with a space in the name), make sure:

1. Your build script handles spaces in directory names properly
2. Node modules install correctly in the workspace
3. File paths are handled correctly by Playwright

Recommended build step command:
```
./jenkins-robust-build-script.sh
```

This script is designed to handle common Jenkins environment issues and will provide detailed output to help troubleshoot any problems.

### Debugging Tips:

- Enable debug logging if tests fail
- Check browser installation logs: `npx playwright install --verbose`
- Verify network connectivity to test URLs
- Ensure sufficient memory allocation for browser processes
- Review the specific error messages in Jenkins console output
- Consider running a simple test first to verify the setup works