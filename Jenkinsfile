pipeline {
    agent any

    stages {

        stage('Deploy: Clone & Copy') {
            steps {
                // Clean old temp directory
                sh 'rm -rf /home/ubuntu/Wofr_frontend'

                // Clone the repository using Jenkins credentials
                git credentialsId: 'wofr-key',
                    url: 'https://github.com/Finrep-Advisors-LLP/WOFR_Frontend.git',
                    branch: 'main'

                // Clear existing files in /var/www/html and copy new files
                sh """
                    sudo rm -rf /var/www/html/*
                    sudo cp -r * /var/www/html/
                """
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
