# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Killing subreport in Primero.
class ManagedReports::SubReports::GhnReport < ManagedReports::SubReport
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
      ManagedReports::Indicators::VerifiedViolationsByPerpetrator.id => 'lookup-grave-violations',
      ManagedReports::Indicators::VerifiedViolationsByRegion.id => 'lookup-grave-violations',
      ManagedReports::Indicators::LateVerificationViolationsByPerpetrator.id => 'lookup-grave-violations',
      ManagedReports::Indicators::LateVerificationViolationsByRegion.id => 'lookup-grave-violations',
      ManagedReports::Indicators::UnverifiedViolationsByPerpetrator.id => 'lookup-grave-violations',
      ManagedReports::Indicators::UnverifiedViolationsByRegion.id => 'lookup-grave-violations'
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
end
