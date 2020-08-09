#!/usr/bin/env groovy

pipeline {
    agent any

    parameters {


        string(
                name: 'BRANCH',
                defaultValue: 'master',
                description: 'Please enter branch/tag name')

        string(
                name: 'APP_VERSION',
                defaultValue: '1.0.0',
                description: 'Please enter version (i.e 1.0.0)')

        string(
                name: 'IMAGE_VERSION',
                defaultValue: 'latest',
                description: 'Please image version(i.e. latest)')

        string(
                name: 'IMAGE_NAME',
                defaultValue: 'pavlin117/postgui',
                description: 'Please enter image version(i.e. pavlin117/postgui)')

        string(
                name: 'POSTGRESQL_SVC_IP',
                defaultValue: '10.110.41.103',
                description: 'Please enter IP address (i.e. 10.110.41.103)')

        password(
                name: 'POSTGRESQL_PASS',
                description: 'Please enter postgres password')

        string(
                name: 'DOCKER_USER',
                description: 'Please enter docker user')

        password(
                name: 'DOCKER_PASS',
                description: 'Please enter docker password')


    }

    environment {

        GURL = "https://github.com/pavlin117/PostGUI.git"

    }

    stages {


        stage("Clean WS") {
            steps {
                script {
                    deleteDir()
                }
            }
        }


        stage("Clone") {
            steps {
                checkout([$class                           : 'GitSCM',
                          branches                         : [[name: "${params.BRANCH}"]],
                          doGenerateSubmoduleConfigurations: false,
                          extensions                       : [],
                          submoduleCfg                     : [],
                          userRemoteConfigs                : [[url: "${env.GURL}"]]])

            }
        }

        stage("Containerize") {
            steps {
                script {
                    sh "docker build . -f Dockerfile -t $IMAGE_NAME:$IMAGE_VERSION"
                    sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
                    sh "docker push $IMAGE_NAME:$IMAGE_VERSION"
                }
            }
        }


        stage("Helm Run PostgreSQL") {
            steps {
                sh """
                    helm repo add bitnami https://charts.bitnami.com/bitnami
                    helm install postgresql bitnami/postgresql \\
                    --set persistence.enabled=false,service.clusterIP=$POSTGRESQL_SVC_IP,postgresqlPassword=$POSTGRESQL_PASS

                """
            }
        }

        stage("Helm Run PostgREST") {
            steps {
                sh """
                helm install postgrest helm-postgrest/
            """
            }
        }

        stage("Helm Run Postgui") {
            steps {
                sh """
                helm install postgui helm-postgui/
                """
            }
        }

    }
}