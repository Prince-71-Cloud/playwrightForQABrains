pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps
    }

    environment {
        NODE_VERSION = '18'
        CI = 'true'
        DISPLAY = ':99'  // For headless browser testing
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh '''
                    # Check if system dependencies are available
                    if ! ldd $(which chromium-browser || which google-chrome) >/dev/null 2>&1; then
                        echo "System dependencies may be missing. Please ensure Playwright dependencies are pre-installed on Jenkins agent."
                        echo "For Ubuntu: sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2"
                        echo "For CentOS/RHEL: sudo yum install -y alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 libdrm.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXfixes.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXss.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 nspr.x86_64 nss.x86_64"
                    fi

                    # Install Playwright Chrome browser only
                    npx playwright install chromium
                '''
            }
        }

        stage('Install Allure Commandline') {
            steps {
                sh '''
                    # Check if allure is already installed globally
                    if command -v allure &> /dev/null; then
                        echo "Allure is already installed globally"
                        allure --version
                    else
                        # Install allure commandline tool locally
                        wget https://github.com/allure-framework/allure2/releases/download/2.24.0/allure-2.24.0.tgz
                        tar -xzf allure-2.24.0.tgz -C /tmp
                        mkdir -p $HOME/allure
                        mv /tmp/allure-2.24.0/* $HOME/allure/
                        echo "export PATH=$PATH:$HOME/allure/bin" >> $HOME/.bashrc
                        export PATH=$PATH:$HOME/allure/bin
                        allure --version
                    fi
                '''
            }
        }

        stage('Run Playwright Tests') {
            stage('Chrome Tests') {
                steps {
                    sh '''
                        mkdir -p test-results/chrome
                        mkdir -p allure-results/chrome
                        ALLURE_ENABLED=true npx playwright test --project=chromium --output=test-results/chrome/ --reporter=line,allure-playwright
                    '''
                }
                post {
                    always {
                        archiveArtifacts artifacts: 'test-results/chrome/**/*', allowEmptyArchive: true
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    # Use Chrome Allure results for report generation
                    # Generate Allure report from Chrome test results
                    allure generate allure-results/chrome -o allure-report --clean
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report',
                        reportFiles: 'index.html',
                        reportName: 'Allure Report'
                    ])
                }
            }
        }

        stage('Generate Playwright Report') {
            steps {
                sh '''
                    npx playwright show-report
                '''
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
            }
        }
    }

    post {
        always {
            // Archive test results
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            
            // Archive screenshots and videos if they exist
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
    }
}