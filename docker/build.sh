#!/bin/bash

set -euxo pipefail

# Grab the variables set in the defaults
# These must be passed in explicitly with --build-arg
# and the defined again as an
source ./defaults.env
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

BUILD_NGINX="docker build -f nginx/Dockerfile . -t primero/nginx:${tag}"
BUILD_BEANSTALKD="docker build -f beanstalkd/Dockerfile . -t primero/beanstalkd:${tag} --build-arg BEANSTALKD_PORT=${BEANSTALKD_PORT}"
BUILD_SOLR="docker build -f solr/Dockerfile ../ -t primero/solr:${tag}"
BUILD_APP="docker build -f application/Dockerfile ../ -t primero/application:${tag} --build-arg APP_ROOT=${APP_ROOT} --build-arg RAILS_LOG_PATH=${RAILS_LOG_PATH}"
BUILD_POSTGRES="docker build -f postgres/Dockerfile . -t primero/postgres:${tag}"

apply_tags () {
  local image=${1}
  docker tag "primero/${image}:${tag}" "primeroims/${image}:${tag}"
  docker tag "primero/${image}:${tag}" "${repository}/primero/${image}:${tag}"
  if [[ "${with_latest}" == true ]] ; then
    docker tag "primero/${image}:${tag}" "primero/${image}:latest"
    docker tag "primero/${image}:${tag}" "primeroims/${image}:latest"
    docker tag "${repository}/primero/${image}:${tag}" "${repository}/primero/${image}:latest"
  fi
}

# this could use getopts for building multiple containers
case ${image} in
  nginx)
    eval "${BUILD_NGINX}" && apply_tags nginx
    ;;
  beanstalkd)
    eval "${BUILD_BEANSTALKD}" && apply_tags beanstalkd
    ;;
  solr)
    eval "${BUILD_SOLR}" && apply_tags solr
    ;;
  application)
    eval "${BUILD_APP}" && apply_tags application
    ;;
  postgres)
    eval "${BUILD_POSTGRES}" && apply_tags postgres
    ;;
  all)
    eval "${BUILD_APP}" && apply_tags application
    eval "${BUILD_SOLR}" && apply_tags solr
    eval "${BUILD_BEANSTALKD}" && apply_tags beanstalkd
    eval "${BUILD_NGINX}" && apply_tags nginx
    eval "${BUILD_POSTGRES}" && apply_tags postgres
    ;;
  *)
    echo "${USAGE}"
    exit 1
  ;;
esac
