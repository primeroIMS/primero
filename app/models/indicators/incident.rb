# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Incident Class for Indicators
  class Incident
    OPEN_ENABLED = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
    ].freeze

    def self.violation_category_verification_status
      Violation::TYPES.each_with_object([]) do |violation_type, acc|
        Violation::VERIFICATION_STATUS.each do |verification_status|
          indicator_name = "#{violation_type}_#{verification_status}"
          acc << QueriedIndicator.new(
            name: indicator_name, record_model: ::Incident, scope_to_owned_by_groups: true,
            queries: OPEN_ENABLED + [SearchFilters::Value.new(field_name: indicator_name, value: true)]
          )
        end
      end
    end

    def self.violation_category_region(role)
      admin_level = role&.incident_reporting_location_config&.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL

      PivotedIndicator.new(
        name: 'violations_category_region',
        record_model: ::Incident,
        pivots: ["incident_location#{admin_level}", 'violation_category'],
        scope: OPEN_ENABLED,
        scope_to_owned_by_groups: true
      ).freeze
    end
  end
end
