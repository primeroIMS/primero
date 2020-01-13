# frozen_string_literal: true

require 'csv'

module Exporters
  # This generates a CSV report of all cases that share the same value
  # for certain core identifiers such as national id and UNHCR number.
  class DuplicateIdCSVExporter < ConfigurableExporter

    ID_FIELD_NAMES = %w[
      national_id_no case_id unhcr_individual_no
      name age sex family_count_no
    ].freeze

    PROPERTIES = {
      'moha_id' => ['national_id_no'],
      'national_id_no' => ['national_id_no'],
      'case_id' => ['case_id'],
      'progress_id' => ['unhcr_individual_no'],
      'child_name_last_first' => lambda do |c|
        return '' if c.name.blank?

        name_array = c.name&.split(' ')
        name_array.size > 1 ? "#{name_array.last}, #{name_array[0..-2].join(' ')}" : c.name
      end,
      'age' => ['age'],
      'sex_mapping_m_f_u' => lambda do |c|
        if %w[male female].include?(c.sex)
          I18n.t("exports.duplicate_id_csv.#{c.sex}_abbreviation")
        else
          I18n.t('exports.unhcr_csv.unknown_abbreviation')
        end
      end,
      'family_size' => ['family_count_no']
    }.freeze

    class << self
      def id
        'duplicate_id_csv'
      end

      def mime_type
        'csv'
      end

      def supported_models
        [Child]
      end

      def authorize_fields_to_user?
        false
      end
    end

    def initialize(output_file_path = nil)
      super(output_file_path, export_config_id)
      @fields = Field.find_by_name(ID_FIELD_NAMES).to_a
      @properties = properties_to_export(PROPERTIES)
      @headers = [' '] +
                 @properties.keys.map do |prop|
                   I18n.t("exports.duplicate_id_csv.headers.#{prop}")
                 end
    end

    def export(cases, *_args)
      duplicate_export = CSV.generate do |rows|
        write_header(rows)
        cases.each_with_index do |record, index|
          write_case(record, index, rows)
        end
      end
      buffer.write(duplicate_export)
    end

    def write_header(rows)
      return if @called_once

      rows << @headers
      @called_once = true
    end

    def write_case(record, index, rows)
      values = @properties.map do |_, generator|
        case generator
        when Array
          value_from_array(record, generator)
        when Proc
          generator.call(record)
        end
      end
      rows << [index + 1] + values
    end

    def value_from_array(record, generator)
      field = @fields.select { |f| f.name.eql?(generator.first) }.first
      value = record.value_for_attr_keys(generator)
      export_value(value, field)
    end

    def export_config_id
      system_settings = SystemSettings.current
      system_settings&.export_config_id&.[]('duplicate_id')
    end
  end
end

