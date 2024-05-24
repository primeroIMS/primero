# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Killing subreport in Primero.
class ManagedReports::SubReports::GhnReport < ManagedReports::SubReport
  def id
    'ghn_report'
  end

  def indicators
    [
      ManagedReports::Indicators::VerifiedInformation,
      ManagedReports::Indicators::VerifiedInformationViolations,
      ManagedReports::Indicators::LateVerification,
      ManagedReports::Indicators::LateVerificationViolations,
      ManagedReports::Indicators::UnverifiedInformation,
      ManagedReports::Indicators::UnverifiedInformationViolations,
      ManagedReports::Indicators::MultipleViolations
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::MultipleViolations.id => %w[lookup-gender-unknown-total lookup-violation-type]
    }.freeze
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
