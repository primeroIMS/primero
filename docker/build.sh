#!/bin/bash

set -ex

BUILD_NGINX="docker build -f nginx/Dockerfile . -t nginx:prim-latest"
BUILD_BEANSTALK="docker build -f beanstalkd/Dockerfile . -t beanstalkd:prim-latest"
BUILD_SOLR="docker build -f solr/Dockerfile ../ -t solr:prim-latest"
BUILD_APP="docker build -f application/Dockerfile ../ -t application:prim-latest"

case $1 in
  nginx)
    eval "$BUILD_NGINX"
    ;;
  beanstalk)
    eval "$BUILD_BEANSTALK"
    ;;
  solr)
    eval "$BUILD_SOLR"
    ;;
  app)
    eval "$BUILD_APP"
    ;;
  all)
    eval "$BUILD_APP"
    eval "$BUILD_SOLR"
    eval "$BUILD_BEANSTALK"
    eval "$BUILD_NGINX"
    ;;
esac
