#!/usr/bin/env bash

source ../venv/bin/activate
DOCKER_HOST="unix:///$(pwd)/docker.sock"
export DOCKER_HOST
