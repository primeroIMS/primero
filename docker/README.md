
# Primero Docker

## Overview

'Hostname': 'Containers Intent'
'details'

application: Primero running with PUMA
    build context: root
beanstalkd:
    build context: ./docker
solr:
    build context: root
nginx: Reverse proxy for Primero.
    Derives it's configuration from .env files
    build context: ./docker

Missing or Incomplete Containers: couchdb, queue-consumer redis

## Setup

Install python, docker, and docker compose in a virtual environment.

```bash
cd ~/primero
virtualenv venv
source venv/bin/activate
pip install docker docker-compose
```

## Configuration

There are currently two configurations: production and local. The primary
difference is that NGINX will try to use let's encrypt in production mode.
Each deployment configuration has an env file. Additionally, there is a
'defaults' file which everything inherits from.

The docker containers are configured through environment variables. Environment
variables are defined in the .env files and are propagated into config files at
run time. The NGINX container makes heavy use of this.

## Building - Background

To reduce build time, most of the containers have their build context set to the
docker directory. The reason for this is that for each container, the entire
build context (ie folder) must be sent to the docker instance. The downside is
that you cannot include files in a container outside of the build context. Thus,
the application and solr containers, which rely on configurations outside of the
docker dir, are set to include the entire project in their build context.

## Building - Instructions

To build simply run: ./build.sh
This will build each container with the tag 'prim-latest'. These will be
referenced in the docker-compose files.

## Building - Deploying with Docker Compose

To put up: `./compose.local.sh up`

## Deploying - Remote

To deploy, use a forwarded docker socket over ssh.

```bash
ssh -nNT -L $HOME/docker.sock:/var/run/docker.sock user@remoteserver.com
```

This will map your remote docker socket locally. To use export your DOCKER_HOST
variable: `DOCKER_HOST="unix:///$HOME/docker.sock`. Alternatively, you can get
this by sourcing `source ./source.sh remote`

Run `docker ps` and you should see you are using your remote server. You will
need to rebuild your containers if they have only been built locally. Check the
defaults.env and production.env and make sure you have set you DOMAIN and
LetsEncrypt settings in the NGINX container. To run use docker-compose,
`./compose.prod.sh up -d`

When building remotely, it will take a few minutes to complete.

## Containers - NGINX and CertBot

Currently, CertBot is being performed from inside of the NGINX container. We are
using supervisor to accomplish this.

## Environmental Substitution

On Primero's Docker, we substitue values in from our Docker environment
into the container config files at runtime. To do this, we place shell style
variables in any config file and then point the sub.sh script towards the
correct folder. This is explained in detail in the sub.sh errata section.

## Technical Errata - sub.sh

Dependencies: envsubst and bash

The sub.sh script performs substitutions on configuration files during runtime
container creation. We are primarily using this for the NGINX container
creation.

The container looks through the specified folder for any files ending in
`.template`. It looks for any shell style variables: `$HOST` or `${HOST}` and
performs substitution from the environment (ie .env files). It will create a
copy of the file without the `.template` suffix.

Note: the script will not perform substitutions on variables that are not
defined. For example, NGINX config files use the shell variable style for
internal variables. These will be left alone.

The substitution are performed during the container entrypoint script. To use
add the follow section to your entrypoint.

```bash
# Search each of these directories for .template files and perform substitution
# If you want this to be done from environment, redefine TEMPLATE_DIRS not
TEMPLATE_DIRS_DEFAULT=( "/etc/nginx/conf.d" )
TEMPLATE_DIRS=( "${TEMPLATE_DIRS[@]:-"${TEMPLATE_DIRS_DEFAULT[@]}"}" )
for prim_filename in "${TEMPLATE_DIRS[@]}"/*.template
do
  # here we actually do the environment substitution
  /sub.sh "${prim_filename}"
done
```

The list of folders to operate on are stored as a bash array. Edit the list of
folders to operate on. This can also be overridden in the environment.

## Technical Errata - Containers

The entrypoints run in bash. Bash must be installed on the containers.

