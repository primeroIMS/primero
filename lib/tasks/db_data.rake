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
          PrimeroProgram, Report, Role, Replication, SystemSettings, SystemUsers, User, UserGroup
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
      puts "Writing forms to #{file_name}"

      workbook = WriteExcel.new(File.open(file_name, 'w'))
      header = ['Form Group', 'Form Name', 'Field ID', 'Field Type', 'Field Name', 'Visible?', 'Options', 'Help Text', 'Guiding Questions']

      primero_module = PrimeroModule.get(module_id)
      forms = primero_module.associated_forms_grouped_by_record_type(false)
      forms = forms[type]
      form_hash = FormSection.group_forms(forms)
      form_hash.each do |group, form_sections|
        form_sections.sort_by{|f| [f.order, (f.is_nested? ? 1 : -1)]}.each do |form|
          write_out_form(form, workbook, header, show_hidden)
        end
      end

      workbook.close
    end

    def write_out_form(form, workbook, header, show_hidden)
      if show_hidden || form.visible? || form.is_nested?
        puts "Exporting form #{form.name}"
        worksheet = workbook.add_worksheet("#{(form.name)[0..20].gsub(/[^0-9a-z ]/i, '')}_#{form.parent_form}")
        worksheet.write(0, 0, form.name)
        worksheet.write(1, 0, header)
        form.fields.each_with_index do |field, i|
          if show_hidden || field.visible?
            visible = field.visible? ? 'Yes' : 'No'
            options = ''
            if ['radio_button', 'select_box', 'check_boxes'].include?(field.type)
              options = field.options_list.join(', ')
            elsif field.type == 'subform'
              subform = field.subform_section
              puts "Identifying subform #{subform.name}"
              options = "Subform: #{subform.name}"
              write_out_form(subform, workbook, header, show_hidden)
            end
            field_type = field.type
            field_type += " (multi)" if field.type == 'select_box' && field.multi_select
            worksheet.write((i+2),0,[form.form_group_name, form.name, field.name, field_type, field.display_name, visible, options, field.help_text, field.guiding_questions])
          end
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

  end


end

