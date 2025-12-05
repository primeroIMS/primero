# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Killing subreport in Primero.
class ManagedReports::SubReports::GhnReport < ManagedReports::SubReport
  EXCLUDED_VIOLATION_TYPES = %w[deprivation_liberty military_use].freeze

  def id
    'ghn_report'
  end

  # rubocop:disable Metrics/MethodLength
  def indicators
    [
      ManagedReports::Indicators::VerifiedInformation,
      ManagedReports::Indicators::VerifiedInformationViolations,
      ManagedReports::Indicators::VerifiedViolationsByPerpetrator,
      ManagedReports::Indicators::VerifiedViolationsByRegion,
      ManagedReports::Indicators::LateVerification,
      ManagedReports::Indicators::LateVerificationViolations,
      ManagedReports::Indicators::LateVerificationViolationsByPerpetrator,
      ManagedReports::Indicators::LateVerificationViolationsByRegion,
      ManagedReports::Indicators::UnverifiedInformation,
      ManagedReports::Indicators::UnverifiedInformationViolations,
      ManagedReports::Indicators::UnverifiedViolationsByPerpetrator,
      ManagedReports::Indicators::UnverifiedViolationsByRegion,
      ManagedReports::Indicators::MultipleViolations,
      ManagedReports::Indicators::GroupMultipleViolations
    ]
  end
  # rubocop:enable Metrics/MethodLength

  def lookups
    {
      ManagedReports::Indicators::VerifiedViolationsByPerpetrator.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::LateVerificationViolationsByPerpetrator.id =>
        'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::LateVerificationViolationsByRegion.id => 'Location',
      ManagedReports::Indicators::VerifiedViolationsByRegion.id => 'Location',
      ManagedReports::Indicators::UnverifiedViolationsByPerpetrator.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::UnverifiedViolationsByRegion.id => 'Location'
    }.freeze
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::VerifiedViolationsByPerpetrator.id => violation_type_options,
      ManagedReports::Indicators::VerifiedViolationsByRegion.id => violation_type_options,
      ManagedReports::Indicators::LateVerificationViolationsByPerpetrator.id => violation_type_options,
      ManagedReports::Indicators::LateVerificationViolationsByRegion.id => violation_type_options,
      ManagedReports::Indicators::UnverifiedViolationsByPerpetrator.id => violation_type_options,
      ManagedReports::Indicators::UnverifiedViolationsByRegion.id => violation_type_options
    }
  end

  def display_graph
    false
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end

  def table_type
    id
  end

  def violation_type_options
    @violation_type_options ||= Lookup.find_by(
      unique_id: 'lookup-violation-type'
    ).lookup_values.reject do |value|
      EXCLUDED_VIOLATION_TYPES.include?(value['id'])
    end + [{ id: 'total', display_text: I18n.t('managed_reports.total') }]
  end
end
