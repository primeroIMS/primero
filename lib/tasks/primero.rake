# frozen_string_literal: true

require 'write_xlsx'

namespace :primero do
  desc 'Remove records'
  task :remove_records, [:type] => :environment do |_, args|
    types = [Child, TracingRequest, Incident, PotentialMatch]
    types = [Object.const_get(args[:type])] if args[:type].present?
    puts "Deleting all #{types.join(', ').name} records"
    types.each(&:destroy_all)
    Sunspot.remove_all(type)
  end

  desc 'Export the configuraton as Ruby seed files'
  task :export_config_ruby, [:export_directory] => :environment do |_, args|
    export_directory = args[:export_directory] || 'seed-files'
    if export_directory == '-'
      export_directory = 'tmp'
      export_file = 'seeds.rb'
      exporter = Exporters::RubyConfigExporter.new(export_dir: export_directory, file: export_file)
      exporter.export
      File.foreach("#{export_directory}/#{export_file}") { |line| puts line }
    else
      puts "Exporting current configuration to #{export_directory}"
      exporter = Exporters::RubyConfigExporter.new(export_dir: export_directory)
      exporter.export
    end
  end

  # Saves off the current configuration state of Primero to a json file.
  # This includes Forms, Fields, Lookups, Agencies, Roles, User Groups, and Reports.
  # USAGE: rails primero:export_config_json[file_name]
  # Args:
  #   file_name  (optional)    - The name of the JSON config data file to be created
  #                              If the file_name is not provided, one is generated using the config version
  #                              Example: tmp/config_data.20201230.094913.638a661.json
  # Examples:
  #   rails primero:export_config_json
  #
  #   rails primero:export_config_json[tmp/config_data.json]
  #
  desc 'Exports a JSON config file and creates a PrimeroConfiguration record'
  task :export_config_json, %i[file_name] => :environment do |_, args|
    user = User.new(user_name: 'system_operator')

    puts 'Building Current Configuration'
    configuration = PrimeroConfiguration.current(user)
    configuration.name = 'Config Export'
    configuration.description = 'Config Export by System Operator'
    configuration.save!
    file_name = args[:file_name] || "tmp/config_data.#{configuration.version}.json"
    puts "Exporting JSON Config to #{file_name}"
    File.open(file_name, 'w') { |file| file.write(configuration.to_json) }
  end

  # Imports a JSON config file and creates a PrimeroConfiguration record.  It does not apply the config.
  # USAGE: rails primero:import_config_json[file_name]
  # Args:
  #   file_name             - The JSON config data file to be imported
  #
  # Examples:
  #   rails primero:import_config_json[tmp/config_data.json]
  desc 'Imports a JSON config file and creates a PrimeroConfiguration record'
  task :import_config_json, %i[file_name] => :environment do |_, args|
    file_name = args[:file_name]
    if file_name.blank?
      puts 'ERROR: No input file provided'
      return
    end

    puts "Importing JSON Config from #{file_name}"
    File.open(file_name) do |file|
      config_data = Importers::JSONImporter.import(file)
      if config_data.blank?
        puts 'ERROR: No json data provided'
      else
        user = User.new(user_name: 'system_operator')
        configuration = PrimeroConfiguration.new_with_user(user)
        configuration.attributes = config_data
        configuration.save!
      end
    end
  end

  # Applies a PrimeroConfiguration record.  It expects the PrimeroConfiguration record to already exist.
  # USAGE: rails primero:apply_config[version]
  # Args:
  #   version             - The version id of the PrimeroConfiguration to apply
  #
  # Examples:
  #   rails primero:apply_config[20201230.094913.638a661]
  #
  # WARNING:  This fails if SystemSettings is not populated because of the apply_with_api_lock! method.
  #           The API lock uses SystemSettings to do the lock
  #           If you have an empty DB or have wiped metadata, you need to load SystemSettings before running this
  desc 'Applies a PrimeroConfiguration record'
  task :apply_config, %i[version] => :environment do |_, args|
    version = args[:version]
    if version.blank?
      puts 'ERROR: No Configuration version provided'
      return
    end

    configuration = PrimeroConfiguration.find_by(version: version)
    if configuration.blank?
      puts "ERROR: Configuration #{version} not found"
      return
    end

    user = User.new(user_name: 'system_operator')
    puts "Applying Configuration #{version}"
    configuration.apply_with_api_lock!(user)
  end

  # Exports Forms for translation & Exports Lookups for translation
  # USAGE: rails primero:export_form_translation
  # Args:
  #   unique_id          - if this is passed in, will only export that 1 form  (ex. 'basic_identity')
  #   record_type        - record type (ex. 'case', 'incident', 'tracing_request', etc)     DEFAULT: 'case'
  #   module_id          - (ex. 'primeromodule-cp', 'primeromodule-gbv')                    DEFAULT: 'primeromodule-cp'
  #   show_hidden        - Whether or not to include hidden fields                          DEFAULT: false
  #   locale             - (ex. 'en', 'es', 'fr', 'ar')                                     DEFAULT: 'en'
  # NOTE:
  #   No spaces between arguments in argument list
  # Examples:
  #   Defaults to exporting all forms for 'case' & 'primeromodule-cp'
  #      rails primero:export_form_translation
  #
  #   Exports only 'basic_identity' form
  #      rails primero:export_form_translation[basic_identity]
  #
  #   Exports only tracing_request forms for CP, including hidden forms & fields
  #      rails primero:export_form_translation['',tracing_request,primeromodule-cp,true,en]
  #
  #   Exports only the GBV forms
  #      rails primero:export_form_translation['','',primeromodule-gbv]
  desc 'Export the forms to a yaml file to be translated'
  task :export_form_translation, %i[unique_id record_type module_id show_hidden locale] => :environment do |_, args|
    puts 'Exporting forms to YAML for translation ...'
    args.with_defaults(module_id: 'primeromodule-cp', record_type: 'case', locale: 'en')
    opts = args.to_h
    opts[:visible] = args[:show_hidden].present? && args[:show_hidden].start_with?(/[yYTt]/) ? nil : true
    exporter = Exporters::YmlConfigExporter.new(opts)
    exporter.export
    puts 'Done!'
  end

  # Imports Form And Lookup translation config files
  # USAGE: rails primero:import_transition_config[file_name]
  #        If the file_name contains 'lookup', it will import lookups, else it will import form sections
  # Args:
  #   file_name             - The translated file to be imported
  #
  # Examples:
  #   rails primero:import_translation_config[action_plan_form.yml]
  #   rails primero:import_translation_config[lookups.yml]
  desc 'Import the form_section or lookup translations yaml'
  task :import_translation_config, %i[file_name] => :environment do |_, args|
    file_name = args[:file_name]
    if file_name.blank?
      puts 'ERROR: No input file provided'
      return
    end

    puts "Importing translations from #{file_name}"
    opts = args.to_h
    importer = Importers::YmlConfigImporter.new(opts)
    importer.import
  end

  # Imports HXL Location data from a csv file
  # USAGE: rails primero:import_hxl_locations[file_name]
  # Args:
  #   file_name             - The CSV file to be imported
  #
  # Example:
  #   rails primero:import_hxl_locations[<path>/hxl_locations.csv]
  desc 'Import an HXL Location csv file'
  task :import_hxl_locations, %i[file_name] => :environment do |_, args|
    file_name = args[:file_name]
    if file_name.blank?
      puts 'ERROR: No input file provided'
      return
    end

    puts "Importing locations from #{file_name}"
    data = File.open(file_name, 'rb').read.force_encoding('UTF-8')
    data_io = StringIO.new(data)
    importer = Importers::CsvHxlLocationImporter.new
    importer.import(data_io)
    puts "Total Rows: #{importer.total}"
    puts "Total Rows Processed: #{importer.success_total}"
    puts "Failed rows: #{importer.failures}" if importer.failures.present?
    puts "Error Messages: #{importer.errors}" if importer.errors.present?
  end

  desc 'Set a default password for all generic users.'
  task default_password: :environment do
    require 'io/console'
    affected_users = User.all.select { |u| u.user_name.start_with? 'primero' }
    if affected_users.size.positive?
      puts 'The following users will have their passwords changed:'
      affected_users.each { |u| puts "  #{u.user_name}" }
      begin
        puts "\nIs that OK? (y/n)"
        ok = STDIN.gets.strip.downcase
        break if %w[y n].include?(ok)
      end
      if ok == 'y'
        puts 'Please enter a new default password:'
        password = STDIN.noecho(&:gets).chomp
        puts 'Enter again to confirm:'
        password_confirmation = STDIN.noecho(&:gets).chomp
        affected_users.each do |user|
          user.password = password
          user.password_confirmation = password_confirmation
          if user.valid?
            user.save!
            puts "Updated #{user.user_name}"
          else
            puts 'Invalid password'
            break
          end
        end
      end
    else
      puts 'No default users found. Aborting'
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

  # If you are planning to load the JSON config, use the remove_config_data task instead
  desc 'Deletes out all metadata. Do this only if you need to reseed from scratch!'
  task :remove_metadata, [:metadata] => :environment do |_, args|
    metadata_models =
      if args[:metadata].present?
        args[:metadata].split(',').map { |m| Kernel.const_get(m) }
      else
        [
          Agency, ContactInformation, Field, FormSection, Location, Lookup, PrimeroModule,
          PrimeroProgram, Report, Role, SystemSettings, UserGroup, ExportConfiguration
        ]
      end

    metadata_models.each do |m|
      puts "Deleting the database for #{m.name}"
      m.destroy_all
    end
  end

  desc 'Deletes out all configurable data. Do this only if you need to reseed from scratch or load a JSON config!'
  task remove_config_data: :environment do
    # Adding in Field model because it is not included in CONFIGURABLE_MODELS but, you cannot delete FormSections
    # unless Fields are deleted first
    config_data_models = [Field] + PrimeroConfiguration::CONFIGURABLE_MODELS.map { |m| Object.const_get(m) }

    config_data_models.each do |m|
      puts "Deleting the database for #{m.name}"
      m.destroy_all
    end
  end

  # Exports Forms to a .xlsx spreadsheet
  # It creates 1 spreadsheet containing a tab for each form
  #
  # USAGE: rails primero:forms_to_spreadsheet
  # Args:
  #   record_type        - record type (ex. 'case', 'incident', 'tracing_request', etc)     DEFAULT: 'case'
  #   module_id          - (ex. 'primeromodule-cp', 'primeromodule-gbv')                    DEFAULT: 'primeromodule-cp'
  #   show_hidden        - Whether or not to include hidden fields                          DEFAULT: false
  # NOTE:
  #   No spaces between arguments in argument list
  # Examples:
  #   Defaults to exporting all forms for 'case' & 'primeromodule-cp'
  #      rails primero:forms_to_spreadsheet
  #
  #   Exports only tracing_request forms for CP, including hidden forms & fields
  #      rails primero:forms_to_spreadsheet[tracing_request,primeromodule-cp,true]
  #
  #   Exports only the GBV forms
  #      rails primero:forms_to_spreadsheet['',primeromodule-gbv]
  desc 'Exports forms to an Excel spreadsheet'
  task :forms_to_spreadsheet, %i[record_type module_id show_hidden] => :environment do |_, args|
    args.with_defaults(module_id: 'primeromodule-cp', record_type: 'case')
    opts = args.to_h
    opts[:visible] = args[:show_hidden].present? && args[:show_hidden].start_with?(/[yYTt]/) ? nil : true
    opts[:file_name] = 'forms.xlsx'
    exporter = Exporters::FormExporter.new(opts)
    exporter.export
    puts "Exported forms to XLSX Spreadsheet #{exporter.file_name}"
  end

  # Example usage: rails primero:role_permissions_to_spreadsheet['tmp/test.xlsx','en']
  desc 'Exports roles permissions to an Excel spreadsheet'
  task :role_permissions_to_spreadsheet, %i[file_name locale] => :environment do |_, args|
    file_name = args[:file_name] || 'role_permissions.xlsx'
    locale = args[:locale] || :en
    puts "Writing role permissions to #{file_name}"
    roles_exporter = Exporters::RolePermissionsExporter.new(file_name, locale)
    roles_exporter.export
    puts 'Done!'
  end

  # Populate the case ID code and case ID Display
  desc 'Populate case ID code and case ID Display on existing Cases'
  task set_case_id_display: :environment do
    puts 'Updating Case ID Display...'
    system_settings = SystemSettings.current
    Child.all.each do |record|
      before = "BEFORE  short_id: #{record.short_id}  case_id_code: #{record.case_id_code}" \
               "  case_id_display: #{record.case_id_display}"
      puts before

      record.case_id_code = record.create_case_id_code(system_settings) if record.case_id_code.blank?
      record.case_id_display = record.create_case_id_display(system_settings) if record.case_id_display.blank?

      after = "AFTER  short_id: #{record.short_id}  case_id_code: #{record.case_id_code}" \
              "  case_id_display: #{record.case_id_display}"
      puys after

      if record.changed?
        puts "SAVING #{record.id}..."
        record.save(validate: false)
      end
      puts '=========================================='
    end
  end

  # For each case having a date_of_birth, recalculate the age based on date_of_birth
  # USAGE:   $bundle exec rake db:data:recalculate_case_ages
  desc 'Recalculate ages on Cases'
  task recalculate_case_ages: :environment do
    puts 'Recalculating ages based on date of birth...'
    # Passing in no params causes recalculate! to recalculate ALL cases
    RecalculateAge.recalculate!
  end

  desc 'Export translations to JS file(s)'
  task :i18n_js do
    Dir.glob(Rails.root.join('public', 'translations-*.js')).each { |file| File.delete(file) }

    require Rails.root.join('config', 'initializers', 'locale.rb')
    require Rails.root.join('config', 'initializers', 'locales_fallbacks.rb')

    I18n::JS.export

    manifest_file = Rails.root.join('config', 'i18n-manifest.txt')
    translations_file = Rails.root.join('public', 'translations.js')
    sha1 = Digest::SHA256.file(translations_file)
    translations_file_fingerprinted = "translations-#{sha1}.js"

    File.rename(translations_file, Rails.root.join('public', translations_file_fingerprinted))
    File.write(manifest_file, translations_file_fingerprinted)
  end
end
