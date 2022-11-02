# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Incident Class for Indicators
  class Incident
    OPEN_ENABLED = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
    ].freeze

    VIOLATIONS_CATEGORY_VERIFICATION_STATUS = FacetedIndicator.new(
      name: 'violations_category_verification_status',
      record_model: ::Incident,
      facet: 'violation_with_verification_status',
      scope: OPEN_ENABLED
    ).freeze

    PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES = FacetedIndicator.new(
      name: 'perpetrator_armed_force_group_party_names',
      record_model: ::Incident,
      facet: 'armed_force_group_party_names',
      scope: OPEN_ENABLED
    )

    def self.violation_category_region(role)
      admin_level = role&.incident_reporting_location_config&.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL

      PivotedIndicator.new(
        name: 'violations_category_region',
        record_model: ::Incident,
        pivots: ["incident_location#{admin_level}", 'violation_with_verification_status'],
        scope: OPEN_ENABLED
      ).freeze
    end
  end
end
