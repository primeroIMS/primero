# frozen_string_literal: true

require 'fileutils'

# Exports the current state of the Primero configuration as Ruby scripts.
# TODO: The exporter does not account for Location, PrimeroModule, PrimeroProgram, SystemSettings
# TODO: Use PrimeroConfiguration. This will allow us to export past configuration states as Ruby.
class Exporters::RubyConfigExporter
  def initialize(export_dir: 'seed-files', file: nil)
    @export_dir = export_dir
    FileUtils.mkdir_p(@export_dir)
    @file = file
    FileUtils.rm("#{@export_dir}/#{@file}") if @file && File.exist?("#{@export_dir}/#{@file}")
    @indent = 0
  end

  def i
    '  ' * @indent
  end

  def _i
    @indent += 1
  end

  def i_
    @indent -= 1
  end

  def file_for(config_name, config_objects = nil)
    return "#{@export_dir}/#{@file}" if @file

    if config_name == 'FormSection' && config_objects.present?
      config_dir = "#{@export_dir}/forms/#{config_objects.last['parent_form']}"
      FileUtils.mkdir_p(config_dir)
      "#{config_dir}/#{config_objects.last['unique_id']}.rb"
    else
      config_dir = "#{@export_dir}/#{config_name.pluralize.underscore}"
      FileUtils.mkdir_p(config_dir)
      "#{config_dir}/#{config_name.underscore}.rb"
    end
  end

  def export
    # TODO: Location, PrimeroModule, PrimeroProgram, SystemSettings, ExportConfiguration, IdentityProvider
    %w[Agency Lookup Report UserGroup Role ContactInformation].each do |config_name|
      config_objects = Object.const_get(config_name).all.map(&:configuration_hash)
      export_config_objects(config_name, config_objects)
    end
    export_forms
  end

  def export_forms
    forms_with_subforms.each do |_, form_with_subforms|
      export_config_objects('FormSection', form_with_subforms.map(&:configuration_hash))
    end
  end

  def forms_with_subforms
    grouped_forms = FormSection.all.group_by do |form|
      form.is_nested ? form.subform_field&.form_section&.unique_id : form.unique_id
    end
    grouped_forms.map do |unique_id, form_and_subforms|
      [unique_id, form_and_subforms.sort_by { |form| form.is_nested? ? 0 : 1 }]
    end.to_h
  end

  def export_config_objects(config_name, objects)
    file_name = file_for(config_name, objects)
    File.open(file_name, 'a') do |f|
      objects.each do |config_object|
        f << config_to_ruby_string(config_name, config_object)
      end
    end
  end

  def config_to_ruby_string(config_name, config_hash)
    ruby_string = "#{i}#{config_name}.create_or_update!(\n"
    _i
    ruby_string += "#{i}#{value_to_ruby_string(config_hash)}"
    i_
    ruby_string + "\n#{i})\n\n"
  end

  # This is a long, recursive method.
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def value_to_ruby_string(value)
    if value.is_a?(Hash)
      ruby_string = "{\n"
      _i
      ruby_string += i
      ruby_string += value.compact.map do |k, v|
        "#{key_to_ruby(k)}: #{value_to_ruby_string(v)}"
      end.join(",\n#{i}")
      i_
      ruby_string + "\n#{i}}"
    elsif value.is_a?(Array)
      ruby_string = '['
      if value.present?
        _i
        ruby_string += "\n#{i}"
        ruby_string += value.map { |v| value_to_ruby_string(v) }.join(",\n#{i}")
        i_
        ruby_string += "\n#{i}"
      end
      ruby_string + ']'
    else
      value.to_json
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def key_to_ruby(key)
    key.include?('-') ? "'#{key}'" : key
  end
end
