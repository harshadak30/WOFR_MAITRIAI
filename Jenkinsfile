pipeline {
    agent any

    environment {

        DEPLOY_PATH = '/var/www/html'
        PROJECT_PATH = '/home/ubuntu/Wofr_frontend'
        GIT_REPO = 'https://github.com/Finrep-Advisors-LLP/WOFR_Frontend.git'
    }

    stages {
        stage('Deploy: Clone & Copy') {
            steps {
                    sh """
                        
                        # Remove old temp if exists
                        sudo rm -rf ${PROJECT_PATH}
                        
                        # Clone fresh
                        git clone ${GIT_REPO} ${PROJECT_PATH}
                        
                        # Clear existing /var/www/html
                        sudo rm -rf ${DEPLOY_PATH}/*
                        
                        # Copy files to /var/www/html
                        sudo cp -r ${PROJECT_PATH}/* ${DEPLOY_PATH}/
                    '
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

