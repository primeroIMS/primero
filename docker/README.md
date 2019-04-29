
# Primero Docker

## Overview

Docker for Primero consists of the following containers: application,
beanstalkd, Nginx, Postgres, and solr.

## Installing Docker and Docker-Compose on Linux

First, install Docker on Linux through the [official docker
website.](https://docs.docker.com/install/).

Next, install python, docker, and docker compose in a virtual environment as
follows:

```bash
cd ~/primero
virtualenv venv
source venv/bin/activate
pip install docker docker-compose
```

## How to Configure the Containers

There are currently two configurations: production and local. The primary
difference is that NGINX will try to use LetsEncrypt in production mode although
this can be changed. Each deployment configuration has an env file.
Additionally, there is a 'defaults' file which always inherits from.

The docker containers are configured through environment variables. Environment
variables are defined in the .env files and are propagated into config files at
run time.

Start by looking at the defaults.env file.

## Building - Background

To reduce build time, most of the containers have their build context set to the
docker directory. The reason for this is that for each container, the entire
build context (ie folder) must be sent to the docker instance. The downside is
that you cannot include files in a container outside of the build context. Thus,
the application and solr containers, which rely on configurations outside of the
docker dir, are set to include the entire project in their build context.

## Building - Instructions

To build simply run: `./build.sh all`
This will build each container with the tag 'prim-latest'. These will be
referenced in the docker-compose files.

## Deploying Locally with Docker Compose

To deploy locally, simply run: `./compose.local.sh up`. The default
configurations provided should work. Local is set to generate and use self
signed SSL certificates.

## Deploying - Remote

There are several ways to deploy remotely. I prefer mounting the Docker socket
over ssh. To mount the socket into your home directory, use the following SSH
call.

```bash
ssh -nNT -L $HOME/docker.sock:/var/run/docker.sock user@remoteserver.com
```

This will map your remote docker socket onto the local file system. In order to
use the socket, you have to tell Docker through an environment variable.
Export your DOCKER_HOST variable: `DOCKER_HOST="unix:///$HOME/docker.sock`.

Run `docker ps` and you should see you are using your remote server. You will
need to rebuild your containers if they have only been built locally.

Check the defaults.env and production.env and make sure you have set you DOMAIN
and LetsEncrypt parameters set appropriately. After that, run with
docker-compose. `./compose.prod.sh up -d`

## Troubleshooting

Primero's Docker containers rely heavily on Docker containers. If you are having
issues, it may make sense to delete all of your volumes and rebuild. Do not do
this on a production instance! You will lose all of your data.

```bash
./compose.prod.sh down
docker volume prune
./build.sh all
./compose.prod.sh up
```

## Containers - NGINX and CertBot

Currently, CertBot is being performed from inside of the NGINX container. We are
using supervisor to accomplish this.

## Environmental Substitution

On Primero's Docker, we substitute values in from our Docker environment
into the container config files at runtime. To do this, we place shell style
variables in any config file and then point the sub.sh script towards the
correct folder. This is explained in detail in the sub.sh errata section.

## Technical Errata - sub.sh

Dependencies: envsubst and bash

The sub.sh script performs substitutions on configuration files during runtime
container creation. Pass sub.sh a folder path and it will search for template
files recursively.

The sub.sh script looks through the specified folder, and all sub-directories,
for any files ending in `.template`. Within those files, it looks for any shell
style variables: `$HOST` or `${HOST}` and performs substitution from the
environment (ie .env files). It will create a copy of the file without the
`.template` suffix.

Note: the script will not perform substitutions on variables that are not
defined. For example, NGINX config files use the shell variable style for
internal variables. These will be left alone.

The substitution are performed during the container entrypoint script. To use
add the follow section to your entrypoint after copying the sub.sh script to the
container root.

```bash
/sub.sh folder_path
```

The list of folders to operate on are stored as a bash array. Edit the list of
folders to operate on. This can also be overridden in the environment.

## Container Requirements

The all entrypoints are written in Bash. Thus, Bash must be installed on the
containers.
