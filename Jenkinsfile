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

        stage('Run Playwright Tests') {
            parallel {
                stage('Chrome Tests') {
                    steps {
                        sh '''
                            mkdir -p test-results/chrome
                            npx playwright test --project=chromium --reporter=line --output=test-results/chrome/
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
                            npx playwright test --project=firefox --reporter=line --output=test-results/firefox/
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
                            npx playwright test --project=webkit --reporter=line --output=test-results/webkit/
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