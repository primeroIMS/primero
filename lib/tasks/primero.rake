require 'writeexcel'

namespace :primero do

  desc "Remove records"
  task :remove_records, [:type] => :environment do |t, args|
    types = [Child, TracingRequest, Incident, PotentialMatch]
    types = [eval(args[:type])] if args[:type].present?
    puts "Deleting all #{types.join(', ').name} records"
    types.each(&:destroy_all)
    Sunspot.remove_all(type)
  end

  desc "Import the configuration bundle"
  task :import_config_bundle, [:json_file] => :environment do |t, args|
    puts "Importing configuration from #{args[:json_file]}"
    File.open(args[:json_file]) do |file|
      model_data = Importers::JSONImporter.import(file)
      ConfigurationBundle.import(model_data, 'system_operator')
    end
  end

  desc "Export the configuration bundle"
  task :export_config_bundle, [:json_file] => :environment do |t, args|
    bundle_json = ConfigurationBundle.export_as_json
    if args[:json_file].present?
      puts "Exporting config bundle JSON to #{args[:json_file]}"
      File.open(args[:json_file], 'w') {|f| f.write(bundle_json) }
    else
      puts bundle_json
    end
  end

  desc "Export the configuraton bundle as Ruby seed files"
  task :export_config_seeds, [:export_directory] => :environment do |t, args|
    export_directory = args[:export_directory]
    export_directory = 'seed-files' unless export_directory.present?
    puts "Exporting current configuration to #{export_directory}"
    exporter = Exporters::RubyConfigExporter.new(export_directory)
    exporter.export
  end

  desc "Import the form translations yaml"
  task :import_form_translation, [:yaml_file] => :environment do |t, args|
    file_name = args[:yaml_file]
    if file_name.present?
      puts "Importing form translation from #{file_name}"
      Importers::YamlI18nImporter.import(file_name, FormSection)
    else
      puts "ERROR: No input file provided"
    end
  end

  # Exports Forms for translation & Exports Lookups for translation
  # USAGE: bundle exec rake db:data:export_form_translation[form_name,type,module_id,show_hidden_forms,show_hidden_fields,locale]
  # Args:
  #   form_name          - if this is passed in, will only export that 1 form  (ex. 'basic_identity')
  #   type               - record type (ex. 'case', 'incident', 'tracing_request', etc)     DEFAULT: 'case'
  #   module_id          - (ex. 'primeromodule-cp', 'primeromodule-gbv')                    DEFAULT: 'primeromodule-cp'
  #   show_hidden_forms  - Whether or not to include hidden forms                           DEFAULT: false
  #   show_hidden_fields - whether or not to include hidden fields                          DEFAULT: false
  #   locale             - (ex. 'en', 'es', 'fr', 'ar')                                     DEFAULT: 'en'
  # NOTE:
  #   No spaces between arguments in argument list
  # Examples:
  #   Defaults to exporting all forms for 'case' & 'primeromodule-cp'
  #      bundle exec rake db:data:export_form_translation
  #
  #   Exports only 'basic_identity' form
  #      bundle exec rake db:data:export_form_translation[basic_identity]
  #
  #   Exports only tracing_request forms for CP, including hidden forms & fields
  #      bundle exec rake db:data:export_form_translation['',tracing_request,primeromodule-cp,true,true,en]
  desc "Export the forms to a yaml file to be translated"
  task :export_form_translation, [:form_id, :type, :module_id, :show_hidden_forms, :show_hidden_fields, :locale] => :environment do |t, args|
    form_id = args[:form_id].present? ? args[:form_id] : ''
    module_id = args[:module_id].present? ? args[:module_id] : 'primeromodule-cp'
    type = args[:type].present? ? args[:type] : 'case'
    show_hidden_forms = args[:show_hidden_forms].present? && ['Y','y','T','t'].include?(args[:show_hidden_forms][0])
    show_hidden_fields = args[:show_hidden_fields].present? && ['Y','y','T','t'].include?(args[:show_hidden_fields][0])
    locale = args[:locale].present? ? args[:locale] : ''
    puts "Exporting forms... Check rails log for details..."
    forms_exporter = Exporters::YmlFormExporter.new(form_id, type, module_id, show_hidden_forms: show_hidden_forms,
                                                    show_hidden_fields: show_hidden_fields, locale: locale)
    forms_exporter.export_forms_to_yaml
    puts "Done!"
  end

  # USAGE: bundle exec rake db:data:import_lookup_translation[yaml_file]
  # Args:
  #   yaml_file             - The translated file to be imported
  # NOTE:
  #   No spaces between arguments in argument list
  # Examples:
  #   bundle exec rake db:data:import_lookup_translation[for_use_primero_lookupsyml_fr.yml]
  desc "Import the lookup translations yaml"
  task :import_lookup_translation, [:yaml_file] => :environment do |t, args|
    file_name = args[:yaml_file]
    if file_name.present?
      puts "Importing lookup translation from #{file_name}"
      Importers::YamlI18nImporter.import(file_name, Lookup)
    else
      puts "ERROR: No input file provided"
    end
  end

  desc "Set a default password for all generic users."
  task :default_password => :environment do
    require 'io/console'
    affected_users = User.all.select{|u| u.user_name.start_with? 'primero'}
    if affected_users.size > 0
      puts "The following users will have their passwords changed:"
      affected_users.each{|u| puts "  #{u.user_name}"}
      begin
        puts "\nIs that OK? (y/n)"
        ok = STDIN.gets.strip.downcase
      end until %w(y n).include?(ok)
      if ok == 'y'
        puts "Please enter a new default password:"
        password = STDIN.noecho(&:gets).chomp
        puts "Enter again to confirm:"
        password_confirmation = STDIN.noecho(&:gets).chomp
        affected_users.each do |user|
          user.password = password
          user.password_confirmation = password_confirmation
          if user.valid?
            user.save!
            puts "Updated #{user.user_name}"
          else
            puts "Invalid password"
            break
          end
        end
      end
    else
      puts "No default users found. Aborting"
    end
  end

  # TODO: Check if this is still useful
  # desc "Recalculates admin_level on all locations"
  # task :recalculate_admin_level => :environment do
  #   locations = Location.all_top_level_ancestors
  #   if locations.present?
  #     locations.each do |lct|
  #       lct.admin_level ||= 0
  #       lct.save!
  #       puts "Updating admin level for all descendants of #{lct.name}"
  #       lct.update_descendants_admin_level
  #     end
  #   end
  # end

  desc "Deletes out all metadata. Do this only if you need to reseed from scratch!"
  task :remove_metadata, [:metadata] => :environment do |t, args|
    metadata_models = if args[:metadata].present?
      args[:metadata].split(',').map{|m| Kernel.const_get(m)}
    else
      [
        Agency, ContactInformation, FormSection, Location, Lookup, PrimeroModule,
        PrimeroProgram, Report, Role, SystemSettings, UserGroup, ExportConfiguration
      ]
    end

    metadata_models.each do |m|
      puts "Deleting the database for #{m.name}"
      m.delete_all
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

  # Example usage: bundle exec rake db:data:role_permissions_to_spreadsheet['tmp/test.xls','en']
  desc "Exports roles permissions to an Excel spreadsheet"
  task :role_permissions_to_spreadsheet, [:file_name, :locale] => :environment do |t, args|
    file_name = args[:file_name] || "role_permissions.xls"
    locale = args[:locale] || :en
    puts "Writing role permissions to #{file_name}"
    roles_exporter = Exporters::RolePermissionsExporter.new(file_name, locale)
    roles_exporter.export_role_permissions_to_spreadsheet
    puts "Done!"
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

  desc "Export translations to JS file(s)"
  task :i18n_js do
    Dir.glob(Rails.root.join('public', 'translations-*.js')).each { |file| File.delete(file)}

    I18n::JS.export

    manifest_file = Rails.root.join('config', 'i18n-manifest.txt')
    translations_file = Rails.root.join('public', 'translations.js')
    md5 = Digest::MD5.file(translations_file)
    translations_file_fingerprinted = "translations-#{md5}.js"

    File.rename(translations_file, Rails.root.join('public', translations_file_fingerprinted))
    File.write(manifest_file, translations_file_fingerprinted)
  end

end
