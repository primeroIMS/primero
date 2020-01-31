# frozen_string_literal: true

require 'csv'

module Exporters
  class UnhcrCSVExporter < ConfigurableExporter
    ID_FIELD_NAMES = %w[
      case_id unhcr_individual_no cpims_id short_id identification_date protection_status
      unhcr_needs_codes sex date_of_birth age separation_cause country_of_origin status
      family_count_no national_id_no name_caregiver
    ].freeze

    class << self
      def id
        'unhcr_csv'
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
      @fields = Field.find_by_name(ID_FIELD_NAMES).inject({}) { |acc, field| acc.merge(field.name => field) }
      @props = properties_to_export(props)
      @props_opt_out = opt_out_properties_to_export(@props)
      @headers = [' '] +
                 @props.keys.map do |prop|
                   I18n.t("exports.unhcr_csv.headers.#{prop}")
                 end
    end

    def export(cases, *_args)
      unhcr_export = CSV.generate do |rows|
        write_header(rows)
        cases.each_with_index do |record, index|
          write_case(record, index, rows)
        end
      end
      buffer.write(unhcr_export)
    end

    def write_header(rows)
      return if @called_once

      rows << @headers
      @called_once = true
    end

    def write_case(record, index, rows)
      props_to_export = opting_out?(record) ? @props_opt_out : @props
      values = props_to_export.map do |_, generator|
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
      field = @fields.values.select { |f| f.name.eql?(generator.first) }.first
      value = record.value_for_attr_keys(generator)
      export_value(value, field)
    end

    #TODO fix governorate_country... that code is pre-i18n when locations used location names instead of location_code
    #TODO: Fix these props. Some of them don't work. A try(:method) is needed in those props to make the export work.
    def props
      {
        'long_id' => ['case_id'],
        'individual_progress_id' => ['unhcr_individual_no'],
        'progres_id' => ['unhcr_individual_no'],
        'cpims_code' => ['cpims_id'],
        'short_id' => ['short_id'],
        'date_of_identification' => ['identification_date'],
        'primary_protection_concerns' => ['protection_status'],
        'secondary_protection_concerns' => lambda do |c|
          export_value(c.unhcr_needs_codes, @fields['unhcr_needs_codes']).join(', ') if c.unhcr_needs_codes.present?
        end,
        'vulnerability_code' => lambda do |c|
          if c.unhcr_needs_codes.present?
            export_value(c.unhcr_needs_codes, @fields['unhcr_needs_codes']).map { |code| code.split('-').first }
                                                                           .join('; ')
          end
        end,
        'vulnerability_details_code' => lambda do |c|
          export_value(c.unhcr_needs_codes, @fields['unhcr_needs_codes']).join('; ') if c.unhcr_needs_codes.present?
        end,
        'governorate_country' => lambda do |c|
          if c.location_current.present?
            hierarchy = c.location_current.split('::')
            hierarchy = (hierarchy[0..1] + [hierarchy.last]).compact if hierarchy.size > 2
            hierarchy = hierarchy.map { |name| name.split(' - ').first }.reverse
            hierarchy.join(' - ')
          end
        end,
        'locations_by_level' => lambda do |c|
          if c.location_current.present?
            lct = Location.find_by(location_code: c.location_current)
            lct.location_codes_and_placenames.map { |l| l.join(', ') }.join('; ')
          end
        end,
        'sex' => ['sex'],
        'sex_mapping_m_f_u' => lambda do |c|
          if %w[male female].include?(c.sex)
            I18n.t("exports.unhcr_csv.#{c.sex}_abbreviation")
          else
            I18n.t('exports.unhcr_csv.unknown_abbreviation')
          end
        end,
        'date_of_birth' => ['date_of_birth'],
        'age' => ['age'],
        'causes_of_separation' => ['separation_cause'],
        'country_of_origin' => ['country_of_origin'],
        'current_care_arrangement' => lambda do |c|
          c.current_care_arrangements.first.care_arrangements_type if c.current_care_arrangements.present?
        end,
        'reunification_status' => lambda do |c|
          return c.tracing_status == 'reunified' ? I18n.t('true') : I18n.t('false') if c.try(:tracing_status).present?

          I18n.t('false')
        end,
        'case_status' => ['status'],
        'family_count_no' => ['family_count_no'],
        'moha_id' => ['national_id_no'],
        'name_of_child_last_first' => lambda do |c|
          return '' if c.name.blank?

          name_array = c.name.try(:split, ' ')
          name_array.size > 1 ? "#{name_array.last}, #{name_array[0..-2].join(' ')}" : c.name
        end,
        'name_of_caregiver' => ['name_caregiver']
      }
    end

    def export_config_id
      #TODO pass SystemSettings in from the controller
      @system_settings = SystemSettings.current
      @system_settings&.export_config_id&.[]('unhcr')
    end
  end
end
