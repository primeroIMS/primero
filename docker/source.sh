#!/usr/bin/env bash

source ../venv/bin/activate
DOCKER_HOST="unix:///$HOME/docker.sock"
export DOCKER_HOST
