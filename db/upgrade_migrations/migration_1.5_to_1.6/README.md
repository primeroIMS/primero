These Migration Scripts are for migrating a system from version v1.3 to version v1.6
====================================================================================


Migrating an old json configuration
===================================

Run these steps in your local dev environment on your Vagrant system


Clear the existing data
-----------------------
- $ bundle exec rake db:data:remove_metadata
- $ bundle exec rake db:migrate:design



Make sure your config/locales.yml has the proper locales for the configuration you are upgrading.
-------------------------------------------------------------------------------------------------
- The development section should have the desired locales.

Example:   (If your config is using English & French locales)

development:
  :default_locale: 'en'
  :locales: ["en", "fr"]
  

To remove Locations from the old json config before importing it (optional)
---------------------------------------------------------------------------
From rails console, read in the old json file, parse it, delete Locations from the hash, write out to new file
Example:
  :001 >  jf = File.open('tmp/config_burkina_1209.json')
  :002 >  jd = JSON.parse(jf.read())
  :003 >  jd.delete('Location')
  :004 >  newFile = File.open('tmp/new_config2.json', 'w')
  :005 >  newFile.write(JSON.pretty_generate(jd))


Load the old json config
------------------------
- $ bundle exec rake db:data:import_config_bundle[<path to json file>]

Example:
  $ bundle exec rake db:data:import_config_bundle[tmp/config_burkina_1209.json]


Run the migration scripts
-------------------------
- $ bundle exec rails r db/upgrade_migrations/migration_1.3_to_1.6/migrate.rb


Test
----


Generate configuration seeds
----------------------------
- $ bundle exec rake db:data:export_config_seeds

This will generate a seed-files directory with the new ruby seeds in the application root directory.
Move that seed-files directory and its contents to the appropriate directory under primero-configuration.


====================================================================================================================


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


Copy data file to your local system (v1.6 or above)
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


Run the migration
-----------------
- $ sudo -Hu primero bash
- $ cd ~/application/
- $ RAILS_ENV=production bundle exec rails r db/upgrade_migrations/migration_1.3_to_1.6/migrate_records.rb

Run the migration scripts
-------------------------------------------------------------------
$ sudo -Hu primero bash
$ cd ~/application/
$ RAILS_ENV=production bundle exec rails r db/migration/0051_update_associated_user_groups.rb


Reindex solr (if you want to test the application with the migrated data)
-------------------------------------------------------------------------
Still as 'primero' user...

- $ RAILS_ENV=production bundle exec rake sunspot:remove_all
- $ RAILS_ENV=production bundle exec rake sunspot:reindex


Restart couchdb and other system processes (just for good measure)
------------------------------------------------------------------
^d to exit primero user back to vagrant user

- $ sudo /srv/primero/bin/primeroctl restart


View the results and test
-------------------------
In your browser...

https://localhost:8443/login
