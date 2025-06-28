pipeline {
    agent any

    stages {

        stage('Deploy: Clone & Copy') {
            steps {
                // Clean old temp directory

                // Clone the repository using Jenkins credentials
                git credentialsId: 'wofr-key',
                    url: 'https://github.com/Finrep-Advisors-LLP/WOFR_Frontend.git',
                    branch: 'main'

                // Clear existing files in /var/www/html and copy new files
                sh """
                    sudo cp -r * /home/ubuntu/Wofr_frontend/
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
