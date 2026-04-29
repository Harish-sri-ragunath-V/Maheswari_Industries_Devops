pipeline {
    agent any

    environment {
        AWS_REGION       = "ap-south-1"
        AWS_ACCOUNT_ID   = "573636634427"
        ECR_BACKEND      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/maheshwari-backend"
        ECR_FRONTEND     = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/maheshwari-frontend"
        CLUSTER_NAME     = "maheswari-cluster"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Harish-sri-ragunath-V/Maheswari_Industries_Devops.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t $ECR_BACKEND:latest .'
                sh 'docker build -t $ECR_FRONTEND:latest -f Dockerfile.frontend .'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

                    docker push $ECR_BACKEND:latest
                    docker push $ECR_FRONTEND:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh 'aws eks update-kubeconfig --name $CLUSTER_NAME --region $AWS_REGION'
                sh 'kubectl apply -f k8s/'
            }
        }

        stage('Restart Deployments') {
            steps {
                sh 'kubectl rollout restart deployment/backend'
                sh 'kubectl rollout restart deployment/frontend'
            }
        }

        stage('Verify') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }
    }

    post {
        success { echo 'Deployed to AWS EKS ✅' }
        failure { echo 'Deployment FAILED ❌' }
    }
}