# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed.

# Please keep the seeding idempotent, as it may be used as a migration if upgrading a production
# instance is necessary and the target version has introduced any new types requiring seeds.
def should_seed? model
  empty = model.database.documents["rows"].count == 0
  puts(empty ? "Seeding #{model}." : "Not seeding #{model}. Already populated.")
  empty
end

# PRIMERO-272
def clean_db_table(table)  
  #TODO - This is a temporary brute force solution
  # Sue has added a story to the backlog to make this more elegant
  # So as to not wipe away any custom fields a user might have created
  puts "Cleaning out existing #{table} before the re-seed"
  dbName = "#{COUCHDB_CONFIG[:db_prefix]}_#{table}_#{COUCHDB_CONFIG[:db_suffix]}"
  myDb = COUCHDB_SERVER.database(dbName)
  myDb.delete!
end

#PRIMERO-269
# This fixes records that have dates in an invalid format
# and if they do not have a "record_state", add one
def fix_case_data
  children = Child.all
  children.each do |child|
    puts "Scrubbing old record data for case #{child.short_id}..."
    
    recordModified = false 
    
    #Change / to - to fix old date formats    
    child.each do |key, value|
      if value.present? && is_a_date_field?(key)
        unless is_date_valid_format?(value)
          puts "#{key}: #{value} is an invalid date format... setting to a default 01-Jan-2000"
          child[key] = "01-Jan-2000"
          recordModified = true
        end
      end
    end
    
    #Add a record_state to old records
    unless child[:record_state].present?
      child.merge! record_state: 'Valid record'
      recordModified = true
    end   
    
    if recordModified
      if child.valid?
        puts "Saving changes to case record..."
        child.save!
      else
        puts "Case still not valid... not saving"
      end
    end
  end
end

#PRIMERO-269
def is_a_date_field? aField
  fs = FormSection.get_form_containing_field aField
  return false unless fs.present?
 
  myField = fs.fields.select {|x| x.name == aField}.first
  myField[:type] == "date_field"  
end

#PRIMERO-269
def is_date_valid_format? aValue
  begin
    Date.strptime(aValue, '%d-%b-%Y')
  rescue
    false
  end  
end



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

#PRIMERO-269
fix_case_data
