#!/usr/bin/env bash
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

source ../venv/bin/activate

if [ "$1" == "remote" ];
then
  DOCKER_HOST="unix:///$HOME/docker.sock"
  export DOCKER_HOST
fi
