require 'csv'

module Exporters
  class UnhcrCSVExporter < ConfigurableExporter
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

    def initialize(output_file_path=nil)
      super(output_file_path, export_config_id)
      @fields = Field.find_by_name([
        'case_id',
        'unhcr_individual_no',
        'cpims_id',
        'short_id',
        'identification_date',
        'protection_status',
        'unhcr_needs_codes',
        'sex',
        'date_of_birth',
        'age',
        'separation_cause',
        'country_of_origin',
        'child_status',
        'family_count_no',
        'national_id_no',
        'name_caregiver'
      ]).inject({}) { |acc, field| acc.merge({ field.name => field }) }
    end

    def export(cases, *args)
      unhcr_export = CSV.generate do |rows|
        # Supposedly Ruby 1.9+ maintains hash insertion ordering
        @props = self.properties_to_export(props)
        @props_opt_out = self.opt_out_properties_to_export(@props)
        rows << [" "] + @props.keys.map{|prop| I18n.t("exports.unhcr_csv.headers.#{prop}")} if @called_first_time.nil?
        @called_first_time ||= true

        cases.each_with_index do |c, index|
          props_to_export = opting_out?(c) ? @props_opt_out : @props
          values = props_to_export.map do |_, generator|
            case generator
            when Array
              self.class.translate_value(@fields[generator.try(:first)].try(:first), c.value_for_attr_keys(generator))
            when Proc
              generator.call(c)
            end
          end
          rows << [index + 1] + values
        end
      end
      self.buffer.write(unhcr_export)
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
        'secondary_protection_concerns' => ->(c) do
          self.class.translate_value(@fields['unhcr_needs_codes'], c.unhcr_needs_codes).join(', ') if c.unhcr_needs_codes.present?
        end,
        'vulnerability_code' => ->(c) do
          self.class.translate_value(@fields['unhcr_needs_codes'], c.unhcr_needs_codes).map{|code| code.split('-').first}.join('; ') if c.unhcr_needs_codes.present?
        end,
        'vulnerability_details_code' => ->(c) do
          self.class.translate_value(@fields['unhcr_needs_codes'], c.unhcr_needs_codes).join('; ') if c.unhcr_needs_codes.present?
        end,
        'governorate_country' => ->(c) do
          if c.try(:location_current).present?
            hierarchy = c.location_current.split('::')
            if hierarchy.size > 2
              hierarchy = (hierarchy[0..1] + [hierarchy.last]).compact
            end
            hierarchy = hierarchy.map{|name| name.split(' - ').first}.reverse
            hierarchy.join(' - ')
          end
        end,
        'locations_by_level' => ->(c) do
          if c.try(:location_current).present?
            lct = Location.find_by(location_code: c.location_current)
            lct.location_codes_and_placenames.map{|l| l.join(", ")}.join("; ")
          end
        end,
        'sex' => ['sex'],
        'sex_mapping_m_f_u' => ->(c) do
          ['male', 'female'].include?(c.sex) ? I18n.t("exports.unhcr_csv.#{c.sex}_abbreviation") : I18n.t("exports.unhcr_csv.unknown_abbreviation")
        end,
        'date_of_birth' => ['date_of_birth'],
        'age' => ['age'],
        'causes_of_separation' => ['separation_cause'],
        'country_of_origin' => ['country_of_origin'],
        'current_care_arrangement' => ->(c) do
          if c.current_care_arrangements.present?
            c.current_care_arrangements.first.care_arrangements_type
          end
        end,
        'reunification_status' => ->(c) do
          if c.try(:tracing_status).present?
            return c.tracing_status == "reunified" ? I18n.t("true") : I18n.t("false")
          else
            I18n.t("false")
          end
        end,
        'case_status' => ['child_status'],
        'family_count_no' => ['family_count_no'],
        'moha_id' => ['national_id_no'],
        'name_of_child_last_first' => ->(c) do
          return '' if c.name.blank?
          name_array = c.name.try(:split, ' ')
          name_array.size > 1 ? "#{name_array.last}, #{name_array[0..-2].join(' ')}" : c.name
        end,
        'name_of_caregiver' => ['name_caregiver']
      }
    end

    def export_config_id
      #TODO pass SystemSettings in from the controller
      @system_settings ||= SystemSettings.current
      @system_settings.try(:export_config_id).try(:[], "unhcr")
    end

  end
end
