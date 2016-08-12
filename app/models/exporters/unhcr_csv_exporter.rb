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

      def export(cases, *args)
        CSV.generate do |rows|
          # Supposedly Ruby 1.9+ maintains hash insertion ordering
          rows << self.field_map.keys

          cases.each do |c|
            rows << @field_map.map do |_, generator|
              case generator
              when Array
                c.value_for_attr_keys(generator)
              when Proc
                generator.call(c)
              end
            end
          end
        end
      end
    end

    @field_map = {
      'Long ID' => ['case_id'],
      'Case ID' => ['short_id'],
      'UNHCR Individual ID Number' => ['unhcr_id_no'],
      'Name' => ['name'],
      'Father Name' => ->(c) { c.fathers_name },
      'Caregiver Name' => ->(c) { c.caregivers_name },
      'Mother Name' => ->(c) { c.mothers_name },
      'Religion of the Child' => ->(c) { c.religion.join(', ') },
      'Nationality' => ->(c) { c.nationality.join(', ') },
      'Ethnic Group of the Child' => ->(c) { c.ethnicity.join(', ') },
      'Ration Card Number' => ['ration_card_no'],
      'Date of Birth' => ['date_of_birth'],
      'Date of Arrival' => ['registration_date'],
      'Flight Information' => ->(c) do
        [c.location_separation, c.separation_cause, c.separation_details].compact.join('; ')
      end,
      'Protection Concern' => ['unhcr_protection_code'],
      'Protection Status' => ['protection_status'],
      'Protection Concerns' => ->(c) { c.protection_concerns.join(', ') },
      'Disability Type' => ['disability_type'],
      'Place of origin' => ['country_of_origin'],
      'Language' => ->(c) { c.language.join(', ') },
    }

  end
end

