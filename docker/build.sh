#!/bin/bash

set -ex

docker build -f application/Dockerfile ../ -t application:prim-latest
docker build -f solr/Dockerfile ../ -t solr:prim-latest
docker build -f couchdb/Dockerfile ../ -t couchdb:prim-latest
