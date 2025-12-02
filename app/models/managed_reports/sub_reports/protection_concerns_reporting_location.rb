# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Describes ProtectionConcernsReportingLocation subreport in Primero.
class ManagedReports::SubReports::ProtectionConcernsReportingLocation < ManagedReports::SubReport
  def id
    'protection_concerns_reporting_location'
  end

  def indicators
    [ManagedReports::Indicators::CaseProtectionConcernsReportingLocation].freeze
  end

  def lookups
    { ManagedReports::Indicators::CaseProtectionConcernsReportingLocation.id => 'ReportingLocation' }.freeze
  end

  def indicators_subcolumns
    { ManagedReports::Indicators::CaseProtectionConcernsReportingLocation.id => 'lookup-gender' }.freeze
  end
end
