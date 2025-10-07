# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a subreport for Process And Quality - Total Cases
class ManagedReports::SubReports::ProcessQualityTotalCases < ManagedReports::SubReport
  def id
    'process_quality_total_cases'
  end

  def indicators
    [
      ManagedReports::Indicators::TotalProtectionManagementCases
    ].freeze
  end

  def lookups
    {
      ManagedReports::Indicators::TotalProtectionManagementCases.id => 'lookup-case-status'
    }.freeze
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::TotalProtectionManagementCases.id => 'lookup-gender-identity'
    }.freeze
  end
end
