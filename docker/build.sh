#!/bin/bash

set -ex

docker build -f application/Dockerfile ../ -t application:prim-latest
docker build -f beanstalkd/Dockerfile . -t beanstalkd:prim-latest
docker build -f solr/Dockerfile ../ -t solr:prim-latest
docker build -f nginx/Dockerfile . -t nginx:prim-latest
