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
            parallel {
                stage('Install Chromium') {
                    steps {
                        sh 'npx playwright install chromium --with-deps'
                    }
                }
                stage('Install Firefox') {
                    steps {
                        sh 'npx playwright install firefox --with-deps'
                    }
                }
                stage('Install WebKit') {
                    steps {
                        sh 'npx playwright install webkit --with-deps'
                    }
                }
            }
        }

        stage('Install Allure Commandline') {
            steps {
                sh '''
                    # Install allure commandline tool
                    wget https://github.com/allure-framework/allure2/releases/download/2.24.0/allure-2.24.0.tgz
                    tar -xzf allure-2.24.0.tgz -C /opt
                    ln -s /opt/allure-2.24.0/bin/allure /usr/local/bin/allure || true
                    allure --version
                '''
            }
        }

        stage('Run Playwright Tests') {
            parallel {
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
                stage('Firefox Tests') {
                    steps {
                        sh '''
                            mkdir -p test-results/firefox
                            mkdir -p allure-results/firefox
                            ALLURE_ENABLED=true npx playwright test --project=firefox --output=test-results/firefox/ --reporter=line,allure-playwright
                        '''
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'test-results/firefox/**/*', allowEmptyArchive: true
                        }
                    }
                }
                stage('WebKit Tests') {
                    steps {
                        sh '''
                            mkdir -p test-results/webkit
                            mkdir -p allure-results/webkit
                            ALLURE_ENABLED=true npx playwright test --project=webkit --output=test-results/webkit/ --reporter=line,allure-playwright
                        '''
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'test-results/webkit/**/*', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    # Aggregate Allure results from all test runs
                    mkdir -p allure-results/all
                    cp -r allure-results/chrome/* allure-results/all/ 2>/dev/null || true
                    cp -r allure-results/firefox/* allure-results/all/ 2>/dev/null || true
                    cp -r allure-results/webkit/* allure-results/all/ 2>/dev/null || true

                    # Generate Allure report
                    allure generate allure-results/all -o allure-report --clean
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