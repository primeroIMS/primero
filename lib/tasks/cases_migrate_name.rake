namespace :db do
  desc "Update CP Cases fields First Name, Middle Name and Last Name from the field Name"
   task :cases_migrate_name => :environment do
     CasesMigrateName.migrate_name_to_fields_names
  end
end