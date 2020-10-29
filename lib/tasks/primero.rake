# frozen_string_literal: true

require 'writeexcel'

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
    opts = args.to_h
    importer = Importers::CsvHxlLocationImporter.new(opts)
    importer.import
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

  desc 'Deletes out all metadata. Do this only if you need to reseed from scratch!'
  task :remove_metadata, [:metadata] => :environment do |_, args|
    metadata_models =
      if args[:metadata].present?
        args[:metadata].split(',').map { |m| Kernel.const_get(m) }
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

  desc 'Exports forms to an Excel spreadsheet'
  task :forms_to_spreadsheet, %i[type module show_hidden] => :environment do |_, args|
    module_id = args[:module].present? ? args[:module] : 'primeromodule-cp'
    type = args[:type].present? ? args[:type] : 'case'
    show_hidden = args[:show_hidden].present?
    file_name = 'forms.xls'
    puts "Writing #{type} #{module_id} forms to #{file_name}"
    forms_exporter = Exporters::FormExporter.new(file_name)
    forms_exporter.export_forms_to_spreadsheet(type, module_id, show_hidden)
    puts 'Done!'
  end

  # Example usage: bundle exec rails primero:role_permissions_to_spreadsheet['tmp/test.xls','en']
  desc 'Exports roles permissions to an Excel spreadsheet'
  task :role_permissions_to_spreadsheet, %i[file_name locale] => :environment do |_, args|
    file_name = args[:file_name] || 'role_permissions.xls'
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
      puts "BEFORE  short_id: #{record.short_id}  case_id_code: #{record.case_id_code}  case_id_display: #{record.case_id_display}"

      record.case_id_code = record.create_case_id_code(system_settings) if record.case_id_code.blank?
      record.case_id_display = record.create_case_id_display(system_settings) if record.case_id_display.blank?

      puts "AFTER  short_id: #{record.short_id}  case_id_code: #{record.case_id_code}  case_id_display: #{record.case_id_display}"

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

  desc 'Export All form Fields and Options'
  # USAGE: $bundle exec rake db:data:xls_export['case','primeromodule-cp',"fr es"]
  # NOTE: Must pass locales as string separated by spaces e.g. "en fr"
  task :xls_export, %i[record_type module_id locales show_hidden_forms show_hidden_fields] => :environment do |_, args|
    module_id = args[:module_id].present? ? args[:module_id] : 'primeromodule-cp'
    record_type = args[:record_type].present? ? args[:record_type] : 'case'
    locales = args[:locales].present? ? args[:locales].split(' ') : []
    show_hidden_forms = args[:show_hidden_forms].present? && %w[Y y T t].include?(args[:show_hidden_forms][0])
    show_hidden_fields = args[:show_hidden_fields].present? && %w[Y y T t].include?(args[:show_hidden_fields][0])
    Rails.logger = Logger.new(STDOUT)
    exporter = Exporters::XlsFormExporter.new(
      record_type, module_id,
      locales: locales, show_hidden_forms: show_hidden_forms, show_hidden_fields: show_hidden_fields
    )
    exporter.export_forms_to_spreadsheet
  end

  desc 'Import Forms from spreadsheets directory'
  # USAGE: $bundle exec rake db:data:xls_import['/vagrant/tmp/exports/forms_export_case_cp_YYYYMMDD.HHMMSS/','case','primeromodule-cp']
  # NOTE: The location being passed is a DIRECTORY in which resides any spreadsheets representation of a form
  task :xls_import, %i[spreadsheet_dir record_type module_id] => :environment do |_, args|
    module_id = args[:module_id].present? ? args[:module_id] : 'primeromodule-cp'
    record_type = args[:record_type].present? ? args[:record_type] : 'case'
    spreadsheet_dir =
      if args[:spreadsheet_dir].present?
        args[:spreadsheet_dir]
      else
        Dir["#{Rails.root}/tmp/imports/*"].max { |a, b| File.mtime(a) <=> File.mtime(b) }
      end
    Rails.logger = Logger.new(STDOUT)
    importer = Importers::XlsImporter.new(spreadsheet_dir, record_type, module_id)
    importer.import_forms_from_spreadsheet
  end

  desc 'Export translations to JS file(s)'
  task :i18n_js do
    Dir.glob(Rails.root.join('public', 'translations-*.js')).each { |file| File.delete(file) }

    I18n::JS.export

    manifest_file = Rails.root.join('config', 'i18n-manifest.txt')
    translations_file = Rails.root.join('public', 'translations.js')
    md5 = Digest::MD5.file(translations_file)
    translations_file_fingerprinted = "translations-#{md5}.js"

    File.rename(translations_file, Rails.root.join('public', translations_file_fingerprinted))
    File.write(manifest_file, translations_file_fingerprinted)
  end
end
