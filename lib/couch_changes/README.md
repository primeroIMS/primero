CouchDB Change Watcher
======================

This module interacts with the CouchDB change API in order to detect and react
to database updates.  It is primarily driven by the reactor library EventMachine.

There are many assumptions that go into this that must be carefully preserved:

 - There is a single Passenger server running the Primero app.  This module
   should be able to handle restarts but it will blow up if there is more than
   one passenger application running.

 - The process using this code is run as root.  This can be done with RVM with
   the `rvmsudo` command.  We need root to be able to query the individual
   Passenger processes.

 - The process using this code is run in the Primero Rails app environment.
   This can be done with the `rails runner` utility.

 - The Rails server doesn't need to be notified about anything that happened
   while it wasn't running.
