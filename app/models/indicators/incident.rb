# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Incident Class for Indicators
  class Incident
    OPEN_CLOSED_ENABLED = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::ValueList.new(field_name: 'status', values: [Record::STATUS_OPEN, Record::STATUS_CLOSED])
    ].freeze

    VIOLATIONS_CATEGORY_VERIFICATION_STATUS = PivotedIndicator.new(
      name: 'violations_category_verification_status',
      record_model: ::Incident,
      pivots: %w[violation_category verification_status],
      scope: OPEN_CLOSED_ENABLED,
      scope_to_owned_by_groups: true
    ).freeze

    def self.violation_category_region(role)
      admin_level = role&.reporting_location_config&.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL

      PivotedIndicator.new(
        name: 'violations_category_region',
        record_model: ::Incident,
        pivots: ["incident_location#{admin_level}", 'violation_category'],
        scope: OPEN_CLOSED_ENABLED,
        scope_to_owned_by_groups: true
      ).freeze
    end
  end
end
