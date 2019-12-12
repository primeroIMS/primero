Docker Production Usage
=======================

**NOTE: Primero currently does NOT use Docker for deployment!!!! This may change at some point in the future, but for now all automated deployments are handled in Chef.**

There are two images that need to be run: the CouchDB image and the application
image itself:

Couch Image
-----------

This image is pretty simple.  It installs CouchDB and Nginx through apt-get
and launches them when run.  Nginx is used as a SSL-enabled reverse-proxy for
Couch to give it HTTPS support.  Both processes are run through Supervisor, a
python based process management application.

It is best to run this image using the [data container pattern]
(https://docs.docker.com/userguide/dockervolumes/#creating-and-mounting-a-data-volume-container).
This will allow you to setup the required configuration before the initial
launch of the database.  You should create the data container with the
following volumes:

 - `/var/lib/couchdb`: The data files for CouchDB live here
 - `/var/log/couchdb`: The log files will be written here
 - `/etc/ssl/primero`: You need to place the CouchDB SSL cert/key in this volume with the name `couch.{crt,key}`
 - `/etc/couchdb/local.d`: You can put additional Couch configuration in this volume

#### Envvars


 - `COUCHDB_PASSWORD`: the admin password for the default `primero` user.  (default: None)

Application Image
-----------------

This image includes everything except for CouchDB, namely Solr, the Couch change
watcher, Nginx and Puma.  It also runs all of these processes using
Supervisor.

#### Envvars

 - `COUCHDB_PASSWORD`: the password for the couch admin user (default: None)
 - `PRIMERO_VIRTUAL_HOST`: virtual host name for the app (e.g. `primero-qa.quoininc.com`) (default: None)


Walkthrough
-----------

The following set of commands should get you set up and running with the
images.  The Couch and application certs come from the VM or you can copy (and
reformat) them out of the relevant attributes in the `dev-node.json` file in this repo.
```
$ docker build -t primero_couch docker/db
$ docker build -t primero_app .
$ docker run -d -v /etc/ssl/primero -v /var/lib/couchdb -v /var/log/couchdb -v /etc/couchdb/local.d --name primero_couch_data ubuntu:14.04

[copy couch cert/key to the volume /etc/ssl/primero in the couch data container and name them couch.key/crt]

$ docker run --name primero_couch_1 -d -P --volumes-from primero_couch_data -e COUCHDB_PASSWORD=primero primero_couch

[put app cert/key in repo tmp/app_certs folder calling them primero.crt/key]

$ docker run --name primero_app_1 --link primero_couch_1:couchdb -e COUCHDB_PASSWORD=primero -e PRIMERO_VIRTUAL_HOST=primero.dev -t -p 9443:443 -v $(pwd)/tmp/app_certs:/etc/ssl/primero -d primero_app
```
