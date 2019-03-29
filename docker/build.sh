#!/bin/bash

set -ex

# docker build -f application/Dockerfile ../ -t application:prim-latest
docker build -f solr/Dockerfile . -t solr:prim-latest
docker build -f nginx_self_signed/Dockerfile . -t nginx_self_signed:prim-latest
docker build -f nginx_lets_encrypt/Dockerfile . -t nginx_lets_encrypt:prim-latest

# TODO: not completed
# docker build -f couchdb/Dockerfile . -t couchdb:prim-latest
