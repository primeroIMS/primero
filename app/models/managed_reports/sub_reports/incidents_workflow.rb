# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Incidents based on workflow status by gender/age subreport in Primero.
class ManagedReports::SubReports::IncidentsWorkflow < ManagedReports::SubReport
  def id
    'incidents_workflow'
  end

  def indicators
    [
      ManagedReports::Indicators::IncidentWorkflowBySexAndAge
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::IncidentWorkflowBySexAndAge.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::IncidentWorkflowBySexAndAge.id => 'AgeRange'
    }
  end
end
