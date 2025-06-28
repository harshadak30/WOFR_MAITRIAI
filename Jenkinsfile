pipeline {
    agent any

    environment {
        DEPLOY_USER = 'ubuntu'
        DEPLOY_HOST = '13.203.16.246'
        DEPLOY_PATH = '/var/www/html'
        PROJECT_PATH = '/home/ubuntu/Wofr_frontend'
        GIT_REPO = 'https://github.com/Finrep-Advisors-LLP/WOFR_Frontend.git'
    }

    stages {
        stage('Deploy: Clone & Copy') {
            steps {
                sshagent (credentials: ["${SSH_KEY_ID}"]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                        set -e
                        
                        # Remove old temp if exists
                        rm -rf ${PROJECT_PATH}
                        
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

