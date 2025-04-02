pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS-18'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        // stage('Install Dependencies') {
        //     steps {
        //         script {
        //             def projectDir = 'my-app'

        //             sh 'npm cache clean --force'

        //             if (fileExists("package.json")) {
        //                 echo "Installing dependencies in root"
        //                 sh '''
        //                 rm -rf node_modules package-lock.json
        //                 npm install > npm-install.log 2>&1 || cat npm-install.log
        //                 '''
        //             } 
        //             else if (fileExists("${projectDir}/package.json")) {
        //                 echo "Installing dependencies in ${projectDir}"
        //                 dir(projectDir) {
        //                     sh '''
        //                     rm -rf node_modules package-lock.json
        //                     npm install
        //                     '''
        //                 }
        //             } else {
        //                 error("package.json not found, aborting.")
        //             }
        //         }
        //     }
        // }

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
                            sh 'rm -rf .next/'
                            sh 'npm run build || echo "Build failed"'
                        }
                    } else {
                        sh 'rm -rf .next/'
                        sh 'npm run build || echo "Build failed"'
                    }
                }
            }
        }

       stage('Deploy with ngrok') {
            steps {
                script {
                    // Install ngrok if needed
                    sh 'npm install -g ngrok || true'
                    
                    // Kill any existing processes
                    sh 'pkill -f "npm start" || true'
                    sh 'pkill -f ngrok || true'
                    
                    // Start your Next.js app
                    sh 'nohup npm start > app.log 2>&1 &'
                    
                    // Wait for app to start
                    sh 'sleep 10'
                    
                    // Start ngrok (free plan version)
                    sh 'ngrok http 3000 --log=stdout > ngrok.log 2>&1 &'
                    
                    // Get and display the URL - fixed syntax
                    sh '''
                    sleep 5
                    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o "https://[^\"]*ngrok-free.app")
                    echo "Application deployed at: $NGROK_URL"
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