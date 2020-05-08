
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
To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

DEVISE_SECRET_KEY - Required. A secure random number.
To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

DEVISE_JWT_SECRET_KEY - Required. A secure random number.
To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

PRIMERO_SECRET_KEY_BASE - Required. A secure random number.
To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

PRIMERO_CONFIGURATION_FILE - Optional. If you would like to run a custom configuration instead of
the default application seeds, you need to bindmount a path on the application container that contains the script.
The recommended value is `/primero-configuration/load_configuration.rb` where `/primero-configuration`
is bind mounted from the host system.

APP_ROOT - file path - this is where Primero gets copied to in the app container.
Default is `strv/primero/application`. Changing this parameter has not been tested.

BEANSTALK_URL - address which Primero should try to access beanstalk.
this should be set to the container name and port

RAILS_ENV - production / development - sets the build / run mode for Primero.

RAILS_LOG_PATH - path - where Primero will store its logs. Set when you want the output logged
to a specific file instead of to the container's standard out.

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

## Primero application configuration

If you want to run Ruby configuration scripts other than the default Primero seeds,
you can run the script below.
It's assumed that a Primero configuration directory will have a script named `load_configuration.rb`.

```
cd docker
./compose.configure.sh /path/to/primero/config/directory
```
