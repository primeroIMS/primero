require 'csv'
require_relative 'base.rb'

module Exporters
  class UnhcrCSVExporter < BaseExporter
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

      attr_accessor :field_map
    end

    def export(cases, *args)
      unhcr_export = CSV.generate do |rows|
        # Supposedly Ruby 1.9+ maintains hash insertion ordering
        rows << [' ID'] + UnhcrCSVExporter.field_map.keys if @called_first_time.nil?
        @called_first_time ||= true

        self.class.load_fields(cases.first)

        cases.each_with_index do |c, index|
          values = UnhcrCSVExporter.field_map.map do |_, generator|
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

    @field_map = {
      'Individual Progress ID' => ['unhcr_individual_no'],
      'CPIMS Code' => ['cpims_id'],
      'Date of Identification' => ['identification_date'],
      'Primary Protection Concerns' => ['protection_status'],
      'Secondary Protection Concerns' => ->(c) do
        self.translate_value('unhcr_needs_codes', c.unhcr_needs_codes).join(', ') if c.unhcr_needs_codes.present?
      end,
      'Governorate - Country' => ->(c) do
        if c.location_current.present?
          hierarchy = c.location_current.split('::')
          if hierarchy.size > 2
            hierarchy = (hierarchy[0..1] + [hierarchy.last]).compact
          end
          hierarchy = hierarchy.map{|name| name.split(' - ').first}.reverse
          hierarchy.join(' - ')
        end
      end,
      'Sex' => ['sex'],
      'Date of Birth' => ['date_of_birth'],
      'Age' => ['age'],
      'Causes of Separation' => ['separation_cause'],
      'Country of Origin' => ['country_of_origin'],
      'Current Care Arrangement' => ->(c) do
        if c.current_care_arrangements.present?
          c.current_care_arrangements.first.care_arrangements_type
        end
      end,
      'Reunification Status ' => ->(c) do
        if c.tracing_status.present?
          return c.tracing_status == "Reunified" ? I18n.t("true") : I18n.t("false")
        else
          I18n.t("false")
        end
      end,
      'Case Status' => ['child_status']
    }

  end
end

