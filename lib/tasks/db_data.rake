require 'writeexcel'

namespace :db do

  namespace :data do

    desc "Create test records for quickly testing out features"
    task :dev_fixtures => :environment do
      unless Rails.env == 'development'
        raise "These fixtures are only meant for development"
      end

      load(Rails.root.join("db/dev_fixtures", "cases.rb"))
      load(Rails.root.join("db/dev_fixtures", "incidents.rb"))
      load(Rails.root.join("db/dev_fixtures", "tracing_requests.rb"))
    end

    desc "Remove records"
    task :remove_records, [:type] => :environment do |t, args|
      types = [Child, TracingRequest, Incident, PotentialMatch]
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
    task :import_json, [:json_file] => :environment do |t, args|
      puts "Importing from #{args[:json_file]}"

      File.open(args[:json_file]) do |f|
        JSON.parse(f.read).each do |obj|
          user = User.find_by_user_name(obj['owned_by']) || User.find_by_user_name('primero')
          inst = Kernel.const_get(obj['model_type']).import(obj.clone, user)
          inst.save!
          puts "Successfully imported #{obj['model_type']} object with id #{inst.id}"
        end
      end
    end

    desc "Import the configuration bundle"
    task :import_config_bundle, [:json_file] => :environment do |t, args|
      puts "Importing configuration from #{args[:json_file]}"
      File.open(args[:json_file]) do |file|
        model_data = Importers::JSONImporter.import(file)
        ConfigurationBundle.import(model_data, 'system_operator')
      end
    end

    desc "Import the form translations yaml"
    task :import_form_translation, [:yaml_file] => :environment do |t, args|
      file_name = args[:yaml_file]
      if file_name.present?
        puts "Importing form translation from #{file_name}"
        file_hash = YAML.load_file(file_name)
        if file_hash.present? && file_hash.is_a?(Hash)
          locale = file_hash.keys.first
          file_hash.values.each{|fh| FormSection.import_translations(fh, locale)}
        else
          puts "Error parsing yaml file"
        end
      else
        puts "ERROR: No input file provided"
      end
    end

    desc "Export the forms to a yaml file to be translated"
    task :export_form_translation, [:form_name, :type, :module, :show_hidden] => :environment do |t, args|
      form_name = args[:form_name].present? ? args[:form_name] : ''
      module_id = args[:module].present? ? args[:module] : 'primeromodule-cp'
      type = args[:type].present? ? args[:type] : 'case'
      show_hidden = args[:show_hidden].present?
      # file_name = "forms.xls"
      # puts "Writing #{type} #{module_id} forms to #{file_name}"
      #TODO fix parameter handling... can I pass in nill form name?
      #TODO add comments
      forms_exporter = Exporters::YmlFormExporter.new(form_name)
      forms_exporter.export_forms_to_yaml
      puts "Done!"
    end


    # Creates Location.create! statements which can be used as a Location seed file
    # USAGE:   $bundle exec rake db:data:generate_locations[json,layers,regions]
    # ARGS:    json - full path and file name of json file
    #          layers - Number of layers in regions list
    #          regions - colon separated list of regions within the country.  List does not include the country name
    # NOTE:    No spaces between arguments in argement list
    # EXAMPLE: $bundle exec rake db:data:generate_locations[/tmp/my_file.json,3,province:district:chiefdom]
    desc "Add locations from a JSON. Regions should be split by colons ex: province:region:prefecture"
    task :generate_locations, :json_file, :layers, :regions do |t, args|

        types = args[:regions].split(':')

        file = open(args[:json_file])
        string = file.read
        parsed = JSON.parse(string) # returns a hash

        #Name of the country
        country = parsed['features'][0]['properties']['CNTRY_NAME']
        country_code = parsed['features'][0]['properties']['CNTRY_CODE']

        #Create the country
        puts "\#Country"
        puts "Location.create! placename: \"#{country}\", location_code:\"#{country_code}\", type: \"country\""

        (1..args[:layers].to_i).each do |layer|
            puts "\n\##{types[layer-1]}"

            placename_key = "ADM#{layer}_NAME"
            location_code_key = "ADM#{layer}_CODE"

            #Save the names in placenames to not to repeat them
            placenames = []
            parsed['features'].each do |feature|

                placename = feature['properties'][placename_key]
                location_code = feature['properties'][location_code_key]

                #Check if that name has been already parsed
                if !placenames.include?(placename) then
                    placenames.push(placename)
                    hierarchy = []
                    hierarchy.push(country)
                    aux_layers = 1

                    #Loop to get the hierarchy
                    while aux_layers<layer do
                        parent_placename = "ADM#{aux_layers}_NAME"
                        hierarchy.push feature['properties'][parent_placename]
                        aux_layers += 1
                    end

                    puts "Location.create! placename:\"#{placename}\", location_code:\"#{location_code}\", type: \"#{types[layer-1]}\", hierarchy: [\"#{hierarchy.join("\", \"")}\"]"
                end
            end
        end

    end

    desc "Import CPIMS"
    task :import_cpims, [:file, :user] => :environment do |t, args|
      puts "Importing from #{args[:file]}"

      user = User.find_by_user_name(args[:user]) || User.find_by_user_name('primero')

      raise "Invalid User" if user.nil?

      puts "Assigning imported records to user '#{user.user_name}'"

      import_cnt = 0
      model_data = Array(Importers::CPIMSImporter.import(args[:file]))
      model_data.map do |md|
        Child.import(md, user)
      end.each do |m|
        m.save!
        puts "Successfully imported case with id #{m.id} case_id #{m.case_id}"
        import_cnt += 1
      end

      puts "Migration complete.  Imported #{import_cnt} cases"
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

    desc "Recalculates admin_level on all locations"
    task :recalculate_admin_level => :environment do
      locations = Location.all_top_level_ancestors
      if locations.present?
        locations.each do |lct|
          lct.admin_level ||= 0
          lct.save!
          puts "Updating admin level for all descendants of #{lct.name}"
          lct.update_descendants_admin_level
        end
      end
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

    desc "Deletes out all metadata. Do this only if you need to reseed from scratch!"
    task :remove_metadata, [:metadata] => :environment do |t, args|
      metadata_models = if args[:metadata].present?
        args[:metadata].split(',').map{|m| Kernel.const_get(m)}
      else
        [
          Agency, ContactInformation, FormSection, Location, Lookup, PrimeroModule,
          PrimeroProgram, Report, Role, Replication, SystemSettings, SystemUsers, UserGroup
        ]
      end

      metadata_models.each do |m|
        puts "Deleting the database for #{m.name}"
        m.database.delete!
      end
    end

    desc "Exports forms to an Excel spreadsheet"
    task :forms_to_spreadsheet, [:type, :module, :show_hidden] => :environment do |t, args|
      module_id = args[:module].present? ? args[:module] : 'primeromodule-cp'
      type = args[:type].present? ? args[:type] : 'case'
      show_hidden = args[:show_hidden].present?
      file_name = "forms.xls"
      puts "Writing #{type} #{module_id} forms to #{file_name}"
      forms_exporter = Exporters::FormExporter.new(file_name)
      forms_exporter.export_forms_to_spreadsheet(type, module_id, show_hidden)
      puts "Done!"
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


    #Populate the case ID code and case ID Display
    desc "Populate case ID code and case ID Display on existing Cases"
    task :set_case_id_display => :environment do
      puts "Updating Case ID Display..."
      system_settings = SystemSettings.current
      Child.all.each do |record|
        puts "BEFORE  short_id: #{record.short_id}  case_id_code: #{record.case_id_code}  case_id_display: #{record.case_id_display}"

        record.case_id_code = record.create_case_id_code(system_settings) if record.case_id_code.blank?
        record.case_id_display = record.create_case_id_display(system_settings) if record.case_id_display.blank?

        puts "AFTER  short_id: #{record.short_id}  case_id_code: #{record.case_id_code}  case_id_display: #{record.case_id_display}"

        if record.changed?
          puts "SAVING #{record.id}..."
          record.save(validate: false)
        end
        puts "=========================================="
      end

    end


    # For each case having a date_of_birth, recalculate the age based on date_of_birth
    # USAGE:   $bundle exec rake db:data:recalculate_case_ages
    desc "Recalculate ages on Cases"
    task :recalculate_case_ages => :environment do
      puts "Recalculating ages based on date of birth..."
      #Passing in no params causes recalculate! to recalculate ALL cases
      RecalculateAge::recalculate!
    end

    desc "Export All form Fields and Options"

    #USAGE: $bundle exec rake db:data:xls_export['case','primeromodule-cp',"fr es"]
    #NOTE: Must pass locales as string separated by spaces e.g. "en fr"
    task :xls_export, [:record_type, :module_id, :locales, :show_hidden_forms, :show_hidden_fields] => :environment do |t, args|
      module_id = args[:module_id].present? ? args[:module_id] : 'primeromodule-cp'
      record_type = args[:record_type].present? ? args[:record_type] : 'case'
      locales = args[:locales].present? ? args[:locales].split(' ') : []
      show_hidden_forms = args[:show_hidden_forms].present? && ['Y','y','T','t'].include?(args[:show_hidden_forms][0])
      show_hidden_fields = args[:show_hidden_fields].present? && ['Y','y','T','t'].include?(args[:show_hidden_fields][0])
      Rails.logger = Logger.new(STDOUT)
      exporter = Exporters::XlsFormExporter.new(record_type, module_id, locales: locales, show_hidden_forms: show_hidden_forms, show_hidden_fields: show_hidden_fields)
      exporter.export_forms_to_spreadsheet
    end

    desc "Import Forms from spreadsheets directory"
    #USAGE: $bundle exec rake db:data:xls_import['/vagrant/tmp/exports/forms_export_case_cp_YYYYMMDD.HHMMSS/','case','primeromodule-cp']
    #NOTE: The location being passed is a DIRECTORY in which resides any spreadsheets representation of a form
    task :xls_import, [:spreadsheet_dir, :record_type, :module_id] => :environment do |t, args|
      module_id = args[:module_id].present? ? args[:module_id] : 'primeromodule-cp'
      record_type = args[:record_type].present? ? args[:record_type] : 'case'
      spreadsheet_dir = args[:spreadsheet_dir].present? ? args[:spreadsheet_dir] : Dir['#{Rails.root}/tmp/imports/*'].sort { |a,b| File.mtime(a) <=> File.mtime(b) }.last
      Rails.logger = Logger.new(STDOUT)
      importer = Importers::XlsImporter.new(spreadsheet_dir,record_type,module_id)
      importer.import_forms_from_spreadsheet
    end

  end
end
