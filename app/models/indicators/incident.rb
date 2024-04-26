# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Incident Class for Indicators
  class Incident
    OPEN_ENABLED = [
      SearchFilters::BooleanValue.new(field_name: 'record_state', value: true),
      SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_OPEN)
    ].freeze

    VIOLATIONS_CATEGORY_VERIFICATION_STATUS = GroupedIndicator.new(
      name: 'violations_category_verification_status',
      record_model: ::Incident,
      pivots: %w[violation_with_verification_status],
      multivalue_pivots: %w[violation_with_verification_status],
      scope: OPEN_ENABLED
    ).freeze

    PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES = GroupedIndicator.new(
      name: 'perpetrator_armed_force_group_party_names',
      record_model: ::Incident,
      pivots: %w[armed_force_group_party_names],
      multivalue_pivots: %w[armed_force_group_party_names],
      scope: OPEN_ENABLED
    )

    def self.violation_category_region(role)
      admin_level = role&.incident_reporting_location_config&.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL

      CustomPivotIndicator.new(
        name: 'violations_category_region',
        record_model: ::Incident,
        pivots: [
          { field_name: 'incident_location', admin_level:, type: 'location' },
          { field_name: 'violation_with_verification_status', multivalue: true }
        ],
        scope: OPEN_ENABLED
      ).freeze
    end
  end
end
# rubocop:enable Style/ClassAndModuleChildren
