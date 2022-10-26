#!/bin/bash

set -euxo pipefail

# Grab the variables set in the defaults
# These must be passed in explicitly with --build-arg
# and the defined again as an
source ./defaults.env
test -e ./local.env && source ./local.env

USAGE="Usage ./build application|nginx|postgres|solr|all [-t <tag>] [-r <repository>] [-b <registry>] [-l]"

if [[ $# -eq 0 ]]; then
  echo "${USAGE}"
  exit 1
fi

image=${1}
shift || true

while getopts "t:r:b:l" opt ; do
  case ${opt} in
    t )
      t=$OPTARG
    ;;
    r )
      r=$OPTARG
    ;;
     b )
      b="${OPTARG}/"
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
build_registry=${b:-""}

BUILD_NGINX="docker build -f nginx/Dockerfile . -t primero/nginx:${tag} -t ${repository}/primero/nginx:${tag} --build-arg NGINX_UID=${NGINX_UID} --build-arg NGINX_GID=${NGINX_GID} --build-arg BUILD_REGISTRY=${build_registry}"
BUILD_SOLR="docker build -f solr/Dockerfile ../ -t primero/solr:${tag} -t ${repository}/primero/solr:${tag} --build-arg BUILD_REGISTRY=${build_registry}"
BUILD_APP="docker build -f application/Dockerfile ../ -t primero/application:${tag} -t ${repository}/primero/application:${tag} --build-arg APP_ROOT=${APP_ROOT} --build-arg RAILS_LOG_PATH=${RAILS_LOG_PATH} --build-arg APP_UID=${APP_UID} --build-arg APP_GID=${APP_GID} --build-arg BUILD_REGISTRY=${build_registry}"
BUILD_POSTGRES10="docker build -f postgres/Dockerfile . -t primero/postgres:${tag}-pg10 -t ${repository}/primero/postgres:${tag}-pg10 --build-arg BUILD_REGISTRY=${build_registry} --build-arg POSTGRES_VERSION=10.22"
BUILD_POSTGRES11="docker build -f postgres/Dockerfile . -t primero/postgres:${tag}-pg11 -t ${repository}/primero/postgres:${tag}-pg11 --build-arg BUILD_REGISTRY=${build_registry} --build-arg POSTGRES_VERSION=11.17"
BUILD_POSTGRES14="docker build -f postgres/Dockerfile . -t primero/postgres:${tag}-pg14 -t ${repository}/primero/postgres:${tag}-pg14 --build-arg BUILD_REGISTRY=${build_registry} --build-arg POSTGRES_VERSION=14.5"

apply_tags () {
  local image=${1}
  local subtag=${2:-""}
  [[ -n "${subtag}" ]] && subtag="-${subtag}"

  docker tag "primero/${image}:${tag}${subtag}" "primeroims/${image}:${tag}${subtag}"
  docker tag "primero/${image}:${tag}${subtag}" "${repository}/primero/${image}:${tag}${subtag}"
  docker tag "primero/${image}:${tag}${subtag}" "${repository}/primeroims/${image}:${tag}${subtag}"
  if [[ "${with_latest}" == true ]] ; then
    docker tag "primero/${image}:${tag}${subtag}" "primero/${image}:latest${subtag}"
    docker tag "primero/${image}:${tag}${subtag}" "primeroims/${image}:latest${subtag}"
    docker tag "${repository}/primero/${image}:${tag}${subtag}" "${repository}/primero/${image}:latest${subtag}"
    docker tag "${repository}/primero/${image}:${tag}${subtag}" "${repository}/primeroims/${image}:latest${subtag}"
  fi
}

# this could use getopts for building multiple containers
case ${image} in
  nginx)
    eval "${BUILD_NGINX}" && apply_tags nginx
    ;;
  solr)
    eval "${BUILD_SOLR}" && apply_tags solr
    ;;
  application)
    eval "${BUILD_APP}" && apply_tags application
    ;;
  postgres)
    eval "${BUILD_POSTGRES10}" && apply_tags postgres pg10
    eval "${BUILD_POSTGRES11}" && apply_tags postgres pg11
    eval "${BUILD_POSTGRES14}" && apply_tags postgres pg14
    ;;
  all)
    eval "${BUILD_APP}" && apply_tags application
    eval "${BUILD_SOLR}" && apply_tags solr
    eval "${BUILD_NGINX}" && apply_tags nginx
    eval "${BUILD_POSTGRES10}" && apply_tags postgres pg10
    eval "${BUILD_POSTGRES11}" && apply_tags postgres pg11
    eval "${BUILD_POSTGRES14}" && apply_tags postgres pg14
    ;;
  *)
    echo "${USAGE}"
    exit 1
  ;;
esac
