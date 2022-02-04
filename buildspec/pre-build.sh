#!/bin/bash

set -eux

nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375 --storage-driver=overlay2 &
timeout 15 sh -c "until docker info; do echo .; sleep 1; done"
echo Logging in to Amazon ECR...
aws --version
aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${CONTAINER_REGISTRY}
echo "WEBHOOK=${WEBHOOK}"
if [ "$WEBHOOK" = "true" ]; then BRANCH=$(echo $CODEBUILD_WEBHOOK_HEAD_REF | awk -F/ '{print $NF}'); fi
echo "BRANCH=${BRANCH}"
if [[ "${BRANCH}" =~ "v2." ]]; then
  DEPLOY="false"
  echo "DEPLOY=${DEPLOY}"
  TAG=${BRANCH}
  echo "TAG=${TAG}"
else
  DEPLOY="true"
  echo "DEPLOY=${DEPLOY}"
  TAG=$(docker/git-to-docker-tag.sh ${BRANCH} ${CODEBUILD_RESOLVED_SOURCE_VERSION})
  echo "TAG=${TAG}"
  CICD_TAG=$(echo $BRANCH | awk -F. '/release/ { print $1"."$2 } ; $0 !~ /release/ { print $0 }' | tr . -)
  echo "CICD_TAG=${CICD_TAG}"
  RELEASE_SECRET_KEY=SECRET_VARS_$(echo $CICD_TAG | tr - _)
  echo "RELEASE_SECRET_KEY=${RELEASE_SECRET_KEY}"
  echo "CODEBUILD_SRC_DIR_devops=${CODEBUILD_SRC_DIR_devops}"
  DEPLOY_SERVER_NAME="primero-integration-${CICD_TAG}"
  echo "DEPLOY_SERVER_NAME=primero-integration-${CICD_TAG}"
  DEPLOY_SERVER_INVENTORY_FILE="primero-integration-${CICD_TAG}.vars.yml"
  echo "DEPLOY_SERVER_INVENTORY_FILE=${DEPLOY_SERVER_INVENTORY_FILE}"
  printenv $RELEASE_SECRET_KEY > secrets.json
  mv secrets.json ansible/secrets.json
  ./ansible/bin/activate
  rm -r ansible/inventory/*
  cp ${CODEBUILD_SRC_DIR_devops}/src/vars-files/${DEPLOY_SERVER_INVENTORY_FILE} ansible/vars.yml
  aws s3 sync ansible s3://${BUCKET_NAME}/ansible-${TAG} --sse 'aws:kms'
fi
