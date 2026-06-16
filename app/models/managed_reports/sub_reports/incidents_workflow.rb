# frozen_string_literal: true

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
