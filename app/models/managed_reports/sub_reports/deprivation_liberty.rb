# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes DeprivationLiberty subreport in Primero.
class ManagedReports::SubReports::DeprivationLiberty < ManagedReports::SubReport
  def id
    'deprivation_liberty'
  end

  def indicators
    [
      ManagedReports::Indicators::ViolationTally,
      ManagedReports::Indicators::Perpetrators,
      ManagedReports::Indicators::ReportingLocation,
      ManagedReports::Indicators::DetentionStatus
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::ViolationTally.id => 'lookup-violation-tally-options',
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location'
    }
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end

  def indicators_subcolumns
    sub_column_items = sub_column_items(lookups[ManagedReports::Indicators::ViolationTallyDetention.id])

    {
      ManagedReports::Indicators::PerpetratorsDetention.id => sub_column_items,
      ManagedReports::Indicators::ReportingLocationDetention.id => sub_column_items,
      ManagedReports::Indicators::DetentionStatus.id => sub_column_items
    }
  end
end
