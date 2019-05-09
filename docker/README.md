
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

To deploy remotely, we are going to mount the docker socket of a remote server
and then use our local docker tools. To mount the socket into your home
directory, use the following SSH call.

```bash
ssh -nNT -L $HOME/docker.sock:/var/run/docker.sock user@remoteserver.com
```

This will map your remote docker socket onto the local file system. In order to
use the socket, you have to tell Docker through an environment variable.
Export your DOCKER_HOST variable: `DOCKER_HOST="unix:///$HOME/docker.sock"`.

Run `docker ps` and you should see you are using your remote server. You will
need to rebuild your containers if they have only been built locally. To rebuild
them, run `./build.sh all`

Check the defaults.env and production.env and make sure you have set you DOMAIN
and LetsEncrypt parameters set appropriately. After that, run with
docker-compose. `./compose.prod.sh up -d`

## Configuration Options - Environment Variables

Docker for Primero is configured through environment variables. At runtime, the
containers will generate appropriate configuration files based on what values
you have the environment variables set too.

config option - parameter - description

APP_ROOT - file path - this is where primero gets copied to in the app container. i would
not modify this value.

BEANSTALK_URL - address which primero should try to access beanstalk

RAILS_ENV - production / development - sets the build / run mode for primero.
RAILS_LOG_PATH - path - where primero will store its logs

NGINX_SERVER_HOST - name to put in the self signed certificate. if letsencrypt
is used, then we will store the host name recieved from certbot here.
NGINX_SERVER_NAME - sets the server name in the nginx site config file. ie what
name nginx responds too.
NGINX_SSL_CLIENT_CA, NGINX_SSL_KEY_PATH - path - location where nginx will look
for and store its self signed certificates
nginx_cert
NGINX_HTTP_PORT, NGINX_HTTPS_PORT - port for http/s
NGINX_PROXY_PASS_URL - address which nginx will proxy towards. this should point
towards the app/puma container.
NGINX_LOG_ERROR, NGINX_LOG_ACCESS - name of respective log files.
NGINX_LOG_DIR - path of the folder for the nginx logs
NGINX_KEEPALIVE_TIMEOUT - time out length for nginx
NGINX_DH_PARAM - path of the diffie hellman group. this will be generated
automatically at container start.

USE_LETS_ENCRYPT - set this to `true` to use certbot to generate ssl certs. it
is set to `false` for local by default. if this is set, then you must set the
following as well.
LETS_ENCRYPT_DOMAIN - domain to put on ssl cert. only supports one domain.
LETS_ENCRYPT_EMAIL - email for cert. must be set.

POSTGRES_DATABASE - name - sets the database name for primero to use
POSTGRES_HOSTNAME - name of the app container. this is the address which other
containers will use to access postgres.

SOLR_HOSTNAME - hostname for solr. solr needs to self reference from this
hostname and other containers will access solr using this hostname
SOLR_PORT - port for solr. default is 8983.
SOLR_LOGS_DIR - dir for solr logging
SOLR_LOG_LEVEL - sets the logging level for solr. `INFO` or `ERROR`

LOCALE_DEFAULT - set this to the language which primero will use. `en` by
default.

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
