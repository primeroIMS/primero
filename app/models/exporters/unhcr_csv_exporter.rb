require 'csv'
require_relative 'base.rb'

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
    end

    def export(cases, *args)
      unhcr_export = CSV.generate do |rows|
        # Supposedly Ruby 1.9+ maintains hash insertion ordering
        @props = self.properties_to_export(props)
        rows << [I18n.t("exports.unhcr_csv.headers.id")] + @props.keys.map{|prop| I18n.t("exports.unhcr_csv.headers.#{prop}")} if @called_first_time.nil?
        @called_first_time ||= true

        self.class.load_fields(cases.first) if cases.present?

        cases.each_with_index do |c, index|
          values = @props.map do |_, generator|
            case generator
            when Array
              self.class.translate_value(generator.first, c.value_for_attr_keys(generator))
            when Proc
              generator.call(c)
            end
          end
          rows << [index + 1] + values
        end
      end
      self.buffer.write(unhcr_export)
    end

    def props
      {
        'individual_progress_id' => ['unhcr_individual_no'],
        'progres_id' => ['unhcr_individual_no'],
        'cpims_code' => ['cpims_id'],
        'short_id' => ['short_id'],
        'date_of_identification' => ['identification_date'],
        'primary_protection_concerns' => ['protection_status'],
        'secondary_protection_concerns' => ->(c) do
          self.class.translate_value('unhcr_needs_codes', c.unhcr_needs_codes).join(', ') if c.unhcr_needs_codes.present?
        end,
        'unhcr_needs_codes' => ->(c) do
          self.class.translate_value('unhcr_needs_codes', c.unhcr_needs_codes).join(', ') if c.unhcr_needs_codes.present?
        end,
        'governorate_country' => ->(c) do
          if c.location_current.present?
            hierarchy = c.location_current.split('::')
            if hierarchy.size > 2
              hierarchy = (hierarchy[0..1] + [hierarchy.last]).compact
            end
            hierarchy = hierarchy.map{|name| name.split(' - ').first}.reverse
            hierarchy.join(' - ')
          end
        end,
        'location_in_bangladesh' => ->(c) do
          if c.location_current.present?
            lct = Location.by_location_code(key: c.location_current).first
            lct.ancestor_codes_and_placenames.map{|l| l.join(", ")}.join("\n")
          end
        end,
        'sex' => ['sex'],
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
          if c.tracing_status.present?
            return c.tracing_status == "reunified" ? I18n.t("true") : I18n.t("false")
          else
            I18n.t("false")
          end
        end,
        'case_status' => ['child_status'],
        'family_count_no' => ['family_count_no'],
        'moha_id' => ['national_id_no'],
        'name_of_child_last_first' => ->(c) do
          name_array = c.name.split(' ')
          name_array.size > 1 ? "#{name_array.last}, #{name_array[0..-2].join(' ')}" : c.name
        end,
        'name_of_caregiver' => ['name_caregiver']
      }
    end

    def export_config_id
      #TODO pass SystemSettings in from the controller
      @system_settings ||= SystemSettings.current
      @system_settings.try(:unhcr_export_config_id)
    end

  end
end

