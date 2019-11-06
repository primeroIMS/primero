
# Primero Docker

## Overview

Docker for Primero consists of the following containers: application,
beanstalkd, nginx, postgres, and solr. It is compatible with MacOS and modern
Linux distributions.

## Installing Docker and Docker-Compose on Linux

First, install Docker and Docker Compose from the [official docker
website.](https://docs.docker.com/install/).

## TLDR


Run everything from the `docker` directory:

```
cd docker
```

Build your container images and tag with `latest`:

```
./build all
```

Create a `local.env` environment configuration file by
copying one of the sample files and modifying it accordingly. 
The file `local.env.sample.production` represents the settings that 
are recommended for production-like environments. 
See below for configuration environment variables. 

```
cp local.env.sample.production local.env
vi local.env
```   

Start Primero.

```
./compose.prod.sh up -d
```


## How to Configure the Containers

There are currently two configurations: production and local. The difference is
that production mode, by default, will try and generate Let's Encrypt signed
certificates. This must be configured in the env file. Each deployment
configuration has an env file. Additionally, there is a 'defaults' file which
always inherits from.

The docker containers are configured through environment variables. Environment
variables are defined in the .env files and are propagated into config files at
run time. Each configuration has a respective env file: production.env and
local.env.

Start by looking at the defaults.env file to get a look at which env options can
be modified.

## Folder Structure

All of the Docker components of Primero live in the docker sub folder. Inside
the docker folder are sub folders for each container: application, development,
nginx, etc, and an app_common folder that contains shared resources between the
production and the development container.

## Building - Docker Build Context

To reduce build time, most of the containers have their build context set to the
docker directory. The reason for this is that for each container, the entire
build context (ie folder) must be sent to the docker instance. The downside is
that you cannot include files in a container outside of the build context. Thus,
the application and solr containers, which rely on configurations outside of the
docker dir, are set to include the entire project in their build context.

## Building - Instructions
Make sure you have created the file `docker/local.env`. At the very least it requires 
an entry for `POSTGRES_PASSWORD`.

To build simply run: `./build.sh all`
This will build each container with the tag `latest`. These will be
referenced in the docker-compose files. Pass the `-t <tag>` parameter
to specify a tag other than `latest`. By default the UNICEF ACR service
repository `uniprimeroxacrdev.azurecr.io`, but that can be overwritten with the
`-r <repository>` parameter. The parameter and tag will be applied as a Docker tag on the image.

Note, docker-compose files should not be used as 'docker makefiles.' This will
cause issues down the line. Thus, it is important that building be provided
through other means than the docker-compose file.

## Deploying Locally with Docker Compose

To deploy locally, simply run: `./compose.local.sh up`. The default
configurations provided should work. Local is set to generate and use self
signed SSL certificates.

## Configuration Options - Environment Variables

Docker for Primero is configured through environment variables. At runtime, the
containers will generate appropriate configuration files based on what values
you have the environment variables set to.

config option - parameter - description

PRIMERO_HOST - Required. Set this to the server domain hostname.
If Let's Encrypt is used, this value should match LETS_ENCRYPT_DOMAIN.

PRIMERO_SECRET_KEY_BASE - Required. A secure random number. 
To generate, can use the command `rails secret`

DEVISE_SECRET_KEY - Required. A secure random number. 
To generate, can use the command `rails secret`

DEVISE_JWT_SECRET_KEY - Required. A secure random number. 
To generate, can use the command `rails secret`

APP_ROOT - file path - this is where Primero gets copied to in the app
container. Changing this parameter has not been tested.

BEANSTALK_URL - address which Primero should try to access beanstalk
this should be set to the container name and port

RAILS_ENV - production / development - sets the build / run mode for Primero.
RAILS_LOG_PATH - path - where Primero will store its logs

NGINX_SERVER_HOST - name to put in the self signed certificate. if letsencrypt
is used, then we will store the host name received from CertBot here.
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

POSTGRES_DATABASE - name - sets the database name for Primero to use
POSTGRES_HOSTNAME - name of the app container. this is the address which other
containers will use to access postgres.

SOLR_HOSTNAME - hostname for solr. solr needs to self reference from this
hostname and other containers will access solr using this hostname
SOLR_PORT - port for solr. default is 8983.
SOLR_LOGS_DIR - dir for solr logging
SOLR_LOG_LEVEL - sets the logging level for solr. `INFO` or `ERROR`

LOCALE_DEFAULT - set this to the language which Primero will use. `en` by
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
