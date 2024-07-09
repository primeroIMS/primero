# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Incidents based on violence type by gender/age subreport in Primero.
class ManagedReports::SubReports::IncidentsViolenceType < ManagedReports::SubReport
  def id
    'incidents_violence_type'
  end

  def indicators
    [
      ManagedReports::Indicators::IncidentViolenceTypeBySexAndAge
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::IncidentViolenceTypeBySexAndAge.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::IncidentViolenceTypeBySexAndAge.id => 'AgeRange'
    }
  end
end
