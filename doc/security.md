Primero Security
================

Service Users
-------------
We should follow the general UNIX best practice of giving applications the
least privilege necessary for them to carry out their tasks.  Services should
also be isolated from each other as much as possible.

Therefore, we have setup system users for each service and give them ownership
of their own files:

 - Nginx worker processes run as the user `www-data`

 - The Primero Passegner application process itself, however, runs as the
     `primero` user

 - CouchDB is run as the user `couchdb`

 - The Couch change watcher does run as root because of the need to access the
     passenger-status interface.  However it uses the `capsh` utility to drop
     all capabilities except for the one it needs: `CAP_DAC_READ_SEARCH`, which
     allows it to read the passenger-status password file.

  - Solr is run as a separate user called `solr`

Passenger
---------
Passenger could be run separately as a standalone server instead of as an nginx
module.  This could allow Passenger to run as a non-root user in order to
implement user switching.  However, since currently our application code is run
by Passenger as a restricted user, we see only marginal value in making the
Passenger parent process non-root.  We should, however, keep up with bug fixes
and updates to Passenger in order to help mitigate security risks.

CouchDB
-------
If the IP addresses of all Primero nodes in a deployment are stable, CouchDB
should only be accessible over the network via an IP address whitelist. In
other cases, we would need to implement additional security, such as using a
VPN or client SSL certificates.  Since Futon runs through the same server and
under the same security restrictions as the rest of CouchDB, we have decided to
keep it enabled in production servers to ease debugging and system
administration.  It could be selectively disabled on more sensitive sites,
however.

