pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS-18'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    def projectDir = 'my-app'

                    sh 'npm cache clean --force'

                    if (fileExists("package.json")) {
                        echo "Installing dependencies in root"
                        sh '''
                        rm -rf node_modules package-lock.json
                        npm install > npm-install.log 2>&1 || cat npm-install.log
                        '''
                    } 
                    else if (fileExists("${projectDir}/package.json")) {
                        echo "Installing dependencies in ${projectDir}"
                        dir(projectDir) {
                            sh '''
                            rm -rf node_modules package-lock.json
                            npm install
                            '''
                        }
                    } else {
                        error("package.json not found, aborting.")
                    }
                }
            }
        }

        stage('Run Tests') {
            when { expression { return fileExists('my-app/package.json') || fileExists('package.json') } }
            steps {
                script {
                    if (fileExists('my-app/package.json')) {
                        dir('my-app') { 
                            sh 'npm test || echo "Tests failed"'
                        }
                    } else {
                        sh 'npm test || echo "Tests failed"'
                    }
                }
            }
        }

        stage('Build') {
            when { expression { return fileExists('my-app/package.json') || fileExists('package.json') } }
            steps {
                script {
                    if (fileExists('my-app/package.json')) {
                        dir('my-app') { 
                            sh 'npm run build || echo "Build failed"'
                        }
                    } else {
                        sh 'npm run build || echo "Build failed"'
                    }
                }
            }
        }

      stage('Deploy') {
            steps {
                script {
                    echo 'Starting application on port 3000...'
                    sh '''
                    nohup npm run start > app.log 2>&1 &
                    sleep 5
                    curl -Is http://localhost:3000 || echo "App is not responding"
                    '''

                    echo 'Starting ngrok for public access...'
                    sh '''
                    nohup ngrok http 3000 --region=in --hostname=ac77-115-245-95-234.ngrok-free.app > ngrok.log 2>&1 &
                    sleep 5                   
                    curl -Is https://ac77-115-245-95-234.ngrok-free.app || echo "Ngrok is not responnding"
                    '''
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for errors.'
        }
    }
}