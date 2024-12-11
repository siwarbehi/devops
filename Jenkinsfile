pipeline {
    agent any

    stages {
        stage('Checkout Code and repository') {
            steps {
                echo 'Checking out repository...'
                git branch: 'main', url: 'https://github.com/siwarbehi/devops.git'
            }
        }
        stage('Build frontend') {
            steps {
                script {
                    dir('Frontend\my-angular-app')
                        {bat 'docker build -t frontend .'}
                }
            }
        }

        stage('Build svm') {
            steps {
                script {
                    dir('SVM')
                        {bat 'docker build -t svm .'}
                }
            }
        }
        stage('Build vgg') {
            steps {
                script {
                    dir('vgg')
                        {bat 'docker build -t vgg .'}
                }
            }
        }
        stage('Build and Start Services with Docker Compose') {
            steps {
                script {
                        bat 'docker-compose up -d'
                }
            }
        }


        stage('Push Docker Images') {
            steps {
                script {
                    
                        bat 'docker-compose push'
                }
            }
        }

        stage('Deploy') {
            steps {
                
                echo 'Deploying app...'
            }
        }
    }
}
