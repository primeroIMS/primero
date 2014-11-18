Docker Production Usage
=======================

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

Envvars
+++++++

 - `COUCHDB_PASSWORD`: the admin password for the default `primero` user.  (default: None)

Application Image
-----------------

This image includes everything except for CouchDB, namely Solr, the Couch change
watcher, Nginx and Passenger.  It also runs all of these processes using
Supervisor.

Envvars
+++++++

 - `COUCHDB_PASSWORD`: the password for the couch admin user (default: None)
 - `PRIMERO_VIRTUAL_HOST`: virtual host name for the app (e.g. `primero-qa.quoininc.com`) (default: None)
