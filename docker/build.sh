#!/bin/bash

set -euxo pipefail

# Grab the variables set in the defaults
# These must be passed in explicitly with --build-arg
# and the defined again as an
test -e ./defaults.env && source ./defaults.env
test -e ./local.env && source ./local.env

USAGE="Usage ./build application|beanstalkd|nginx|postgres|solr|all [-t <tag>] [-r <repository>] [-l]"

if [[ $# -eq 0 ]]; then
  echo "${USAGE}"
  exit 1
fi

image=${1}
shift || true

while getopts "t:r:l" opt ; do
  case ${opt} in
    t )
      t=$OPTARG
    ;;
    r )
      r=$OPTARG
    ;;
    l )
      l=true
    ;;
    \? )
      echo "${USAGE}"
      exit 1
    ;;
  esac
done
shift $((OPTIND -1)) || true

tag=${t:-latest}
repository=${r:-"uniprimeroxacrdev.azurecr.io"}
with_latest=${l:-false}

BUILD_NGINX="docker build -f nginx/Dockerfile . -t primero/nginx:${tag} -t ${repository}/primero/nginx:${tag}"
BUILD_BEANSTALKD="docker build -f beanstalkd/Dockerfile . -t primero/beanstalkd:${tag} -t ${repository}/primero/beanstalkd:${tag} --build-arg BEANSTALKD_PORT=${BEANSTALKD_PORT}"
BUILD_SOLR="docker build -f solr/Dockerfile ../ -t primero/solr:${tag} -t ${repository}/primero/solr:${tag}"
BUILD_APP="docker build -f application/Dockerfile ../ -t primero/application:${tag} -t ${repository}/primero/application:${tag} --build-arg APP_ROOT=${APP_ROOT} --build-arg RAILS_LOG_PATH=${RAILS_LOG_PATH}"
BUILD_POSTGRES="docker build -f postgres/Dockerfile . -t primero/postgres:${tag} -t ${repository}/primero/postgres:${tag}"

tag_with_latest () {
  if [[ "${with_latest}" == true ]] ; then
    local image=${1}
    docker tag primero/${image}:${tag} primero/${image}:latest
    docker tag ${repository}/primero/${image}:${tag} ${repository}/primero/${image}:latest
  fi
}

# this could use getopts for building multiple containers
case ${image} in
  nginx)
    eval "${BUILD_NGINX}" && tag_with_latest nginx
    ;;
  beanstalkd)
    eval "${BUILD_BEANSTALKD}" && tag_with_latest beanstalkd
    ;;
  solr)
    eval "${BUILD_SOLR}" && tag_with_latest solr
    ;;
  application)
    eval "${BUILD_APP}" && tag_with_latest application
    ;;
  postgres)
    eval "${BUILD_POSTGRES}" && tag_with_latest postgres
    ;;
  all)
    eval "${BUILD_APP}"
    eval "${BUILD_SOLR}"
    eval "${BUILD_BEANSTALKD}"
    eval "${BUILD_NGINX}"
    eval "${BUILD_POSTGRES}"
    ;;
  *)
    echo "${USAGE}"
    exit 1
  ;;
esac
