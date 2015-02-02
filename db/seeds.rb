# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed.

# Please keep the seeding idempotent, as it may be used as a migration if upgrading a production
# instance is necessary and the target version has introduced any new types requiring seeds.
def should_seed? model
  empty = isTableEmpty? model
  puts(empty ? "Seeding #{model}." : "Not seeding #{model}. Already populated.")
  empty
end

def isTableEmpty? model
  empty = false
  rowCount = model.database.documents["rows"].count
  if rowCount == 0
    empty = true
  elsif rowCount == 1
    empty = model.database.documents["rows"][0]["id"][0..6] == "_design"
  end
  return empty
end

#Reseed the lookups
puts "Seeding Lookups"
require File.dirname(__FILE__) + "/lookups/lookups.rb"
puts "Seeding Locations"
require File.dirname(__FILE__) + "/lookups/locations.rb"

#Create the forms
puts "[Re-]Seeding the forms"
Dir[File.dirname(__FILE__) + '/forms/*/*.rb'].each {|file| require file }


#Reseed the default roles and users, and modules
puts "Seeding Roles"
require File.dirname(__FILE__) + "/users/roles.rb"
puts "Seeding Programs"
require File.dirname(__FILE__) + "/users/default_programs.rb"
puts "Seeding Modules"
require File.dirname(__FILE__) + "/users/default_modules.rb"
puts "Seeding User Groups"
require File.dirname(__FILE__) + "/users/default_user_groups.rb"
puts "Seeding Agencies"
require File.dirname(__FILE__) + "/users/default_agencies.rb"
puts "Seeding Users"
require File.dirname(__FILE__) + "/users/default_users.rb"
puts "Seeding Default Reports"
#require File.dirname(__FILE__) + "/reports/reports.rb"
Dir[File.dirname(__FILE__) + '/reports/*.rb'].each {|file| require file }


#TODO We will to revisit the I18n Setup when we address translations.
#RapidFTR::I18nSetup.reset_definitions

if should_seed? ContactInformation
  ContactInformation.create(:id=>"administrator")
end
