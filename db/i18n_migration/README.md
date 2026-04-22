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
- $ bundle exec rails r db/i18n_migration/migrate.rb


Test
----


Generate configuration seeds
----------------------------
- $ bundle exec rake db:data:export_config_seeds

This will generate a seed-files directory with the new ruby seeds in the application root directory.
Move that seed-files directory and its contents to the appropriate directory under primero-configuration.