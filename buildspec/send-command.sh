#!/bin/bash

set -eux

if [[ "${DEPLOY}" =~ 'true' ]]; then
  aws ssm send-command --document-name "PrimeroCicdDocument" --targets Key=tag:Name,Values="${DEPLOY_SERVER_NAME}" --parameters '{"SourceType":["S3"],"SourceInfo":["{\"path\":\"https://s3.amazonaws.com/'${BUCKET_NAME}'/ansible-'${TAG}'\"}"],"InstallDependencies":["True"],"Verbose":["-v"],"ExtraVariables":["primero_tag='${TAG}' primero_repo_branch='${BRANCH}'"],"CicdTag":["'${TAG}'"]}' --output-s3-bucket-name "${BUCKET_NAME}" --output-s3-key-prefix "ansible-logs" > output.json
  cat output.json
  ./build-report.py -p post_build --send-command
else
  echo "Only building images for tag ${TAG}, not deploying to a cicd server"
  ./build-report.py -p post_build
fi
