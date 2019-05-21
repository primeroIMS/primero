require 'fileutils'

module Exporters
  class RubyConfigExporter

    def initialize(export_dir='seed-files')
      @export_dir = export_dir
      @forms_dir = "#{export_dir}/forms"
      @forms_case_dir = "#{@forms_dir}/case"
      @forms_incident_dir = "#{@forms_dir}/incident"
      @forms_tracing_request_dir = "#{@forms_dir}/tracing_request"
      @lookups_dir = "#{export_dir}/lookups"
      @reports_dir = "#{export_dir}/reports"
      @system_settings_dir = "#{export_dir}/system_settings"
      @users_dir = "#{export_dir}/users"
      @indent = 0
    end

    def i
      "  "*@indent
    end

    def _i
      @indent+=1
    end

    def i_
      @indent-=1
    end

    def export
      FileUtils.makedirs([@forms_case_dir, @forms_incident_dir, @forms_tracing_request_dir, @lookups_dir, @reports_dir, @system_settings_dir, @users_dir])
      configuration_hash = ConfigurationBundle.export

      export_config_objects(configuration_hash['Agency'], "#{@lookups_dir}/agencies.rb")
      export_config_objects(configuration_hash['Lookup'], "#{@lookups_dir}/lookups.rb")
      export_config_objects(configuration_hash['Location'], "#{@lookups_dir}/locations.rb")
      export_config_objects(configuration_hash['Report'], "#{@reports_dir}/reports.rb")
      export_config_objects(configuration_hash['PrimeroModule'], "#{@users_dir}/default_modules.rb")
      export_config_objects(configuration_hash['PrimeroProgram'], "#{@users_dir}/programs.rb")
      export_config_objects(configuration_hash['UserGroup'], "#{@users_dir}/user_groups.rb")
      export_config_objects(configuration_hash['Role'], "#{@users_dir}/roles.rb")
      export_config_objects(configuration_hash['SystemSettings'], "#{@system_settings_dir}/system_settings.rb")
      export_config_objects(configuration_hash['ContactInformation'], "#{@system_settings_dir}/contact_information.rb")

      export_forms(configuration_hash['FormSection'])
    end

    def export_forms(form_objects)
      grouped_forms = {}
      forms_hash = {}
      form_objects.each do |form_object|
        type = form_object['parent_form']
        unique_id = form_object['unique_id']
        file_name = "#{@forms_dir}/#{type}/#{unique_id}.rb"
        forms_hash[unique_id] = form_object
        unless form_object['is_nested']
          grouped_forms[file_name] = [unique_id]
          form_object['fields'].each do |field|
            if field['type'] == 'subform'
              subform_unique_id = field['subform_section_id']
              grouped_forms[file_name] << subform_unique_id
            end
          end
        end
      end

      grouped_forms.each do |file_name, form_ids|
        related_form_objects = form_ids.map{|id| forms_hash[id]}.reverse
        export_config_objects(related_form_objects, file_name)
      end
    end


    def export_config_objects(objects, file_name)
      open(file_name, 'w') do |f|
        objects.each do |config_object|
          f << config_to_ruby_string(config_object)
        end
      end
    end

    def config_to_ruby_string(config_object)
      object_type = config_object['class_name']
      keys = config_object.keys.reject{|k| k.start_with?('id', 'class_name', 'name')}
      name_keys = config_object.keys.select{|k| k.start_with?('name')}
      ruby_string =  "#{i}#{object_type}.create_or_update(\n"
      _i
      name_keys.each do |key|
        ruby_string += "#{i}#{key_to_ruby(key)}: #{value_to_ruby_string(config_object[key])},\n"
      end
      keys.each do |key|
        ruby_string += "#{i}#{key_to_ruby(key)}: #{value_to_ruby_string(config_object[key])},\n"
      end
      i_
      ruby_string += "#{i})\n\n"
    end

    def key_to_ruby(key)
      if key.include?('-')
        "\"#{key}\""
      else
        key
      end
    end

    def value_to_ruby_string(value)
      if value.is_a?(Array)
        if value.present?
          if value[0].is_a?(Hash)
            ruby_string = "[\n"
            _i
            value.each do |v|
              ruby_string += "#{i}{\n"
              _i
              ruby_string += i
              ruby_string += v.map{|k,vv| "\"#{k}\" => #{value_to_ruby_string(vv)}"}.join(",\n#{i}")
              i_
              ruby_string += "\n#{i}},\n"
            end
            i_
            ruby_string += "#{i}]"
          else
            "[ " + value.map(&:to_json).join(", ") + " ]"
          end
        else
          "[]"
        end

      else
        value.to_json
      end
    end

  end
end