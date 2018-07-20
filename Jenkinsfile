pipeline {
  agent {
    docker {
      image 'node:8'
    }

  }
  stages {
    stage('Init config database') {
      steps {
        sh 'cp config/database.dist.json config/database.json'
      }
    }
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
}