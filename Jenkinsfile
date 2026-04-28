pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "maheshwari-cicd-backend"
        DOCKER_IMAGE_FRONTEND = "maheshwari-cicd-frontend"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Harish-sri-ragunath-V/Maheswari_Industries_Devops.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE_BACKEND .'
                sh 'docker build -t $DOCKER_IMAGE_FRONTEND -f Dockerfile.frontend .'
            }
        }

        stage('Stop Old Containers (Optional Cleanup)') {
            steps {
                sh 'docker ps -q --filter "ancestor=$DOCKER_IMAGE_BACKEND" | xargs -r docker stop'
                sh 'docker ps -q --filter "ancestor=$DOCKER_IMAGE_FRONTEND" | xargs -r docker stop'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }

        stage('Restart Deployment (Force Update)') {
            steps {
                sh 'kubectl rollout restart deployment/backend'
                sh 'kubectl rollout restart deployment/frontend'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }
    }

    post {
        success {
            echo 'Deployment to Kubernetes SUCCESS ✅'
        }
        failure {
            echo 'Deployment FAILED ❌'
        }
    }
}