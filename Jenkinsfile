pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS-18'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        EC2_USER = 'ubuntu'  
        EC2_HOST = '35.177.162.241' 
        APP_DIR = '/home/ubuntu/my-app'  
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    echo 'Checking out source code...'
                    checkout scm
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << 'EOF'
                    echo 'Deploying application on EC2...'
                    cd ${APP_DIR} || exit 1
                    git pull origin main || exit 1

                    echo 'Installing dependencies...'
                    rm -rf node_modules package-lock.json
                    npm install

                    echo 'Running tests...'
                    npm test || echo "Tests failed"

                    echo 'Building application...'
                    rm -rf .next/
                    npm run build || echo "Build failed"

                    echo 'Stopping any running app instances...'
                    pkill -f "node .next/server" || echo "No existing process found"
                    sleep 3

                    echo 'Starting application on port 3000...'
                    nohup npm run start > app.log 2>&1 &

                    echo "Deployment completed. App is accessible at http://${EC2_HOST}:3000"
                    EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
            echo "App is accessible at: http://${EC2_HOST}:3000"
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}
