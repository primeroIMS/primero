Migrating production data
===================================

Testing on a local Vagrant system


Copy production data to be migrated (on server that has production data)
------------------------------------------------------------------------
Be careful to preserve couchdb ownership and permissions on all the files.  (use -p to preserve these permissions)
NOTE: If you are migrating from 1.3 or earlier, the couchdb data is in /data instead of /var/lib.

- $ cd /data
- $ sudo cp -rp couchdb couchdb_<tag info>
        example:   sudo cp -rp couchdb couchdb_SL_20190523
- $ sudo tar czvf couchdb_SL_20190523.tar.gz couchdb_SL_20190523


Copy data file to your local system
---------------------------------------------------
scp file from remote system to your local system and move/copy tar file to /var/lib then untar it.

On local system after the file has been copied:
- $ cd /var/lib
- $ sudo tar -xzvf couchdb_SL_20190523.tar.gz

This should extract the copied couchdb into a subdirectory 'couchdb_SL_20190523'


Create a backup of existing local couchdb data (still in /var/lib)
-------------------------------------------------------------------
- $ sudo cp -rp couchdb couchdb_<tag info>
        example:   sudo cp -rp couchdb couchdb_LOCAL_20190523


Load migratated configuration files (created in steps described in top section of this README)
----------------------------------------------------------------------------------------------
Copy the seed-files and all sub directories to your local vagrant system and load the configuration.

- $ sudo -Hu primero bash
- $ cd ~/application/
- $ RAILS_ENV=production bundle exec rake db:data:remove_metadata
- $ RAILS_ENV=production bundle exec rake db:migrate:design
- $ RAILS_ENV=production bundle exec rails r /home/vagrant/primero/tmp/seed-files/load_configuration.rb

^d to exit primero user back to vagrant user


Stop couchdb and other system processes
---------------------------------------
- $ sudo /srv/primero/bin/primeroctl stop
- $ sudo /srv/primero/bin/primeroctl status   #optional - to check status of processes


Load the production data
------------------------
Copy in only the Case(Child), Incident, Tracing Request, and User couchdb records from the copied production db data

- $ cd /var/lib
- $ sudo rm couchdb/primero_child_production.couch
- $ sudo rm -rf couchdb/.primero_child_production_design
- $ sudo cp -p couchdb_SL_20190523/primero_child_production.couch couchdb/.
- $ sudo cp -rp couchdb_SL_20190523/.primero_child_production_design couchdb/.
(Repeat copy steps for Incident and Tracing Request)


Start couchdb and other system processes
---------------------------------------
- $ sudo /srv/primero/bin/primeroctl start
- $ sudo /srv/primero/bin/primeroctl status   #optional - to check status of processes


Run the migrations
-----------------
- $ sudo -Hu primero bash
- $ cd ~/application/

If upgrading from a system prior to 1.4, run the 1.3 to 1.4 migrations
----------------------------------------------------------------------
- $ RAILS_ENV=production bundle exec rails r db/upgrade_migrations/migration_1.3_to_1.4/migrate.rb


Run the 1.4 to 1.5 migration
----------------------------
- $ RAILS_ENV=production bundle exec rails r db/upgrade_migrations/migration_1.4_to_1.5/migrate.rb


Run any locale specific migration scripts from the <locale>/fixtures directory in the config repo
-------------------------------------------------------------------------------------------------
- Refer to README in the <locale>/fixtures directory


Reindex solr (if you want to test the application with the migrated data)
-------------------------------------------------------------------------
Still as 'primero' user...

- $ RAILS_ENV=production bundle exec rake sunspot:remove_all
- $ RAILS_ENV=production bundle exec rake sunspot:reindex


Restart couchdb and other system processes (just for good measure)
------------------------------------------------------------------
^d to exit primero user back to vagrant user

- $ sudo /srv/primero/bin/primeroctl restart





If upgrading from a system prior to 1.4, run the 1.3 to 1.4 migrations

Run the 1.4 to 1.5 migrations
$ bundle exec rails r db/upgrade_migration/migration_1.4_to_1.5/migrate.rb

Run the migration scripts
-------------------------------------------------------------------
- $ sudo -Hu primero bash
- $ cd ~/application/
- $ RAILS_ENV=production bundle exec rails r db/migration/0049_saved_search_add_user_name.rb
- $ RAILS_ENV=production bundle exec rails r db/migration/0050_recalculate_workflow_status.rb