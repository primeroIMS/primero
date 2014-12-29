namespace :db do

  namespace :data do
    desc "Create test records for quickly testing out features"
    task :dev_fixtures => :environment do
      unless Rails.env == 'development'
        raise "These fixtures are only meant for development"
      end

      load(Rails.root.join("db/dev_fixtures", "child_10000_names.rb"))
      load(Rails.root.join("db/dev_fixtures", "cases.rb"))
      load(Rails.root.join("db/dev_fixtures", "incidents.rb"))
      load(Rails.root.join("db/dev_fixtures", "flags.rb"))
      load(Rails.root.join("db/dev_fixtures", "tracing_requests.rb"))
    end

    desc "Remove records"
    task :remove_records, [:type] => :environment do |t, args|
      types = [Child, TracingRequest, Incident]
      if args[:type].present?
        types = [eval(args[:type])]
      end
      types.each do |type|
        puts "Deleting all #{type.name} records"
        type.all.each &:destroy!
        Sunspot.remove_all(type)
      end
    end

    desc "Import JSON"
    task :import_json, [:json_file,:type] => :environment do |t, args|
      puts "Importing #{args[:type]} records from #{args[:json_file]}"
      ctrl = eval(args[:type].pluralize.capitalize + "Controller").new
      file = File.open(args[:json_file])
      ctrl.handle_import(file, Importers::JSONImporter)
    end


    desc "Remove roles and any reference of the role from users."
    task :remove_role, [:role] => :environment do |t, args|
      role = Role.find_by_name(args[:role])
      if role
        result = false
        remove = true
        User.all.all.each do |user|
          if user.role_ids.include?(role.id)
            if user.role_ids.size > 1
              user.role_ids.delete(role.id)
              user_changed = user.save
              puts "Role '#{args[:role]}' removed from user: #{user.user_name}" if user_changed
            else
              remove = false
              puts "Role '#{args[:role]}' can't be removed from user: #{user.user_name} because is the last role of the user."
            end
          end
        end
        result = role.destroy if remove
        puts "Removed role '#{args[:role]}'" if result
        puts "Unable to removed role '#{args[:role]}'" unless result
      else
        puts "Role was not found: '#{args[:role]}'"
      end
    end

    desc "Delete out a user"
    task :remove_user, [:user] => :environment do |t, args|
      #TODO: Do we need to handle record owners, associated users?
      user = User.by_user_name(key: args[:user]).all.first
      if user.present?
        puts "Deleting user #{user.user_name}"
        user.destroy
      end
    end

    desc "Remove locations by key"
    task :remove_locations, [:location_key] => :environment do |t, args|
      name = args[:location_key]
      puts "Removing locations hierarchy starting at #{name}"
      locations = Location.find_by_location(name)
      locations.each(&:destroy)
    end

    desc "Allocates default modules to records"
    task :set_module_defaults => :environment do

      cp_module_id =  PrimeroModule.by_name(key: "CP").all.first.id
      mrm_module_id = PrimeroModule.by_name(key: "MRM").all.first.id

      Child.all.each do |child|
        unless child.module_id.present?
          child.module_id = cp_module_id
          child.save(validate: false)
        end
      end

      TracingRequest.all.each do |tracing_request|
        unless tracing_request.module_id.present?
          tracing_request.module_id = cp_module_id
          tracing_request.save(validate: false)
        end
      end

      Incident.all.each do |incident|
        unless incident.module_id.present?
          incident.module_id = mrm_module_id
          incident.save(validate: false)
        end
      end

    end


    #Assign the default owner of all records to be the creator.
    #If no creator exits, set it to be the fallback_user
    desc "Assign default record owner for Cases, Incidents, and Tracing Requests"
    task :set_default_record_owner, [:fallback_user_name] => :environment do |t, args|

      [Child, Incident, TracingRequest].each do |record_class|
        record_class.all.each do |record|
          owner_id = record.created_by.present? ? record.created_by : args[:fallback_user_name]
          unless record.owned_by.present?
            record.owned_by = owner_id
            record.save(validate: false)
          end
        end
      end

    end

  end


end

