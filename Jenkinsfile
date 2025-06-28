pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to Nginx') {
            steps {
                echo '🚀 Deploying pre-built dist to Nginx...'
                sh 'sudo rm -rf /var/www/html/*'
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
