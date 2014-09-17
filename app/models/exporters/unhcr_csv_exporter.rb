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

      attr_accessor :field_map

      def export(cases, _)
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
      'UNHCR Individual ID Number' => ['unhcr_id_no'],
      'Name' => ['name'],
      'Father Name' => lambda do |c|
        c.family_details_section.select{|fd| fd.relation.downcase == 'father'}[0].try(:relation_name)
      end,
      'Caregiver Name' => lambda do |c|
        c.name_caregiver || c.family_details_section.select {|fd| fd.relation_is_caregiver == 'Yes' }[0].try(:relation_name)
      end,
      'Mother Name' => lambda do |c|
        c.family_details_section.select{|fd| fd.relation.downcase == 'mother'}[0].try(:relation_name)
      end,
      'Religion of the Child' => lambda do |c|
        c.religion.join(', ')
      end,
      'Nationality' => lambda do |c|
        c.nationality.join(', ')
      end,
      'Ethnic Group of the Child' => lambda do |c|
        c.ethnicity.join(', ')
      end,
      'Ration Card Number' => ['ration_card_no'],
      'Date of Birth' => ['date_of_birth'],
      'Date of Arrival' => ['registration_date'],
      'Flight Information' => lambda do |c|
        [c.location_separation, c.separation_cause, c.separation_details].compact.join('; ')
      end,
      'Protection Concern' => ['UNHCR_protection_code'],
      'Protection Status' => ['protection_status'],
      'Protection Concerns' => lambda do |c|
        c.protection_concerns.join(', ')
      end,
      'Disability Type' => ['disability_type'],
      'Place of origin' => ['country_of_origin'],
      'Language' => lambda do |c|
        c.language.join(', ')
      end,
    }

  end
end

