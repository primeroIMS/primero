#!/usr/bin/env bash

source ../venv/bin/activate

if [ "$1" == "remote" ];
then
  DOCKER_HOST="unix:///$HOME/docker.sock"
  export DOCKER_HOST
fi
