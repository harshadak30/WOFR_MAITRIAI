pipeline {
    agent any

    stages {
        stage('Deploy: Clone & Copy') {
            steps {
                    sh """
                        
                        # Remove old temp if exists
                        rm -rf /home/ubuntu/Wofr_frontend
                        
                        # Clone fresh
                        git clone https://github.com/Finrep-Advisors-LLP/WOFR_Frontend.git /home/ubuntu/Wofr_frontend
                        
                        # Clear existing /var/www/html
                        sudo rm -rf /var/www/html/*
                        
                        # Copy files to /var/www/html
                        sudo cp -r /home/ubuntu/Wofr_frontend/* /var/www/html/
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

