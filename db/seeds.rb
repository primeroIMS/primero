# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed.

# Please keep the seeding idempotent, as it may be used as a migration if upgrading a production
# instance is necessary and the target version has introduced any new types requiring seeds.

ENV['PRIMERO_BOOTSTRAP'] = 'true'

def should_seed? model
  empty = table_empty?(model) || ENV['NO_RESEED'] != 'true'
  puts(empty ? "Seeding #{model}." : "Not seeding #{model}. Already populated.")
  empty
end

def table_empty?(model)
  model.all.empty?
end

#Reseed the lookups
puts "Seeding Lookups"
require File.dirname(__FILE__) + "/lookups/lookups.rb" if should_seed? Lookup

#Export Configuration must be loaded before the System Settings are loaded
puts "Seeding Export Configuration"
require File.dirname(__FILE__) + "/exports/configuration.rb" if should_seed?(ExportConfiguration)

#Seed the system settings table
puts "Seeding the system settings"
require File.dirname(__FILE__) + "/system_settings/system_settings.rb" if should_seed? SystemSettings

#Create the forms
puts "[Re-]Seeding the forms"
Dir[File.dirname(__FILE__) + '/forms/*/*.rb'].each {|file| require file } if should_seed? FormSection

#Reseed the default roles and users, and modules
puts "Seeding Programs"
require File.dirname(__FILE__) + "/users/default_programs.rb" if should_seed?(PrimeroProgram)
puts "Seeding Modules"
require File.dirname(__FILE__) + "/users/default_modules.rb" if should_seed?(PrimeroModule)
puts "Seeding Roles"
require File.dirname(__FILE__) + "/users/roles.rb" if should_seed?(Role)
puts "Seeding User Groups"
require File.dirname(__FILE__) + "/users/default_user_groups.rb" if should_seed?(UserGroup)
puts "Seeding Agencies"
require File.dirname(__FILE__) + "/users/default_agencies.rb" if should_seed?(Agency)
puts "Seeding Users"
require File.dirname(__FILE__) + "/users/default_users.rb" if should_seed?(User)
puts "Seeding Default Reports"
#require File.dirname(__FILE__) + "/reports/reports.rb"
Dir[File.dirname(__FILE__) + '/reports/*.rb'].each {|file| require file } if should_seed?(Report)


#TODO We will to revisit the I18n Setup when we address translations.
#Primero::I18nSetup.reset_definitions

if should_seed? ContactInformation
  #A little hacky, but no need to write a create_or_update method
  ContactInformation.create(name: 'administrator') if table_empty?(ContactInformation)
end

#TODO: This is being temporarily removed: v1.5 and v1.6 GBV field keys are mismatched. Need to reconcile before re-enabling
# puts "Loading Form Translations"
# Dir[File.dirname(__FILE__) + '/translations/gbv/*/*.yml'].each do |file|
#   puts file
#   clazz = file.end_with?('lookups.yml') ? Lookup : FormSection
#   Importers::YamlI18nImporter.import(file, clazz)
# end