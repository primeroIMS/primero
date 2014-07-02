# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed.

# Please keep the seeding idempotent, as it may be used as a migration if upgrading a production
# instance is necessary and the target version has introduced any new types requiring seeds.
def should_seed? model
  empty = model.database.documents["rows"].count == 0
  puts(empty ? "Seeding #{model}." : "Not seeding #{model}. Already populated.")
  empty
end

def clean_db_table(table)
  # PRIMERO-272
  #TODO - This is a temporary brute force solution
  # Sue has added a story to the backlog to make this more elegant
  # So as to not wipe away any custom fields a user might have created
  puts "Cleaning out existing #{table} before the re-seed"
  dbName = "#{COUCHDB_CONFIG[:db_prefix]}_#{table}_#{COUCHDB_CONFIG[:db_suffix]}"
  myDb = COUCHDB_SERVER.database(dbName)
  myDb.delete!
end

# TODO - PRIMERO -
# This is temporary so the new default users will load
# NEED TO REMOVE BEFORE GOING TO PRODUCTION!!!
clean_db_table('user')
clean_db_table('role')

if should_seed? User
  require File.dirname(__FILE__) + "/users/roles.rb"
  require File.dirname(__FILE__) + "/users/default_users.rb"
end

#Create the forms
clean_db_table('form_section')
puts "[Re-]Seeding the forms"
Dir[File.dirname(__FILE__) + '/forms/*/*.rb'].each {|file| require file }


#TODO We will to revisit the I18n Setup when we address translations.
#RapidFTR::I18nSetup.reset_definitions

if should_seed? ContactInformation
  ContactInformation.create(:id=>"administrator")
end
