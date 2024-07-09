# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on workflow status by gender/age subreport in Primero.
class ManagedReports::SubReports::ReportingLocations < ManagedReports::SubReport
  def id
    'reporting_locations'
  end

  def indicators
    [
      ManagedReports::Indicators::ReportingLocationBySexAndAge
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::ReportingLocationBySexAndAge.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::ReportingLocationBySexAndAge.id => 'AgeRange'
    }
  end
end
