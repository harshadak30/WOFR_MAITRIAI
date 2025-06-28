pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                echo '⚙️ Building project...'
                sh 'npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                echo '🚀 Deploying to Nginx...'

                // Clear existing files
                sh 'sudo rm -rf /var/www/html/*'

                // Copy new build to Nginx folder
                sh 'sudo cp -r dist/* /var/www/html/'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
