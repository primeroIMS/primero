Migrating an old json configuration
===================================

Run these steps in your local dev environment on your Vagrant system


Clear the existing data
-----------------------
- $ bundle exec rake db:data:remove_metadata
- $ bundle exec rake db:migrate:design

Load users????


Make sure your config/locales.yml has the proper locales for the configuration you are upgrading.
-------------------------------------------------------------------------------------------------
- The development section should have the desired locales.

Example:   (If your config is using English & French locales)

development:
  :default_locale: 'en'
  :locales: ["en", "fr"]
  
  
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
#TODO