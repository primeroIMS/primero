# frozen_string_literal: true

# Describes Incidents base on workflow status by gender/age subreport in Primero.
class ManagedReports::SubReports::IncidentsWorkflow < ManagedReports::SubReport
  def id
    'incidents_workflow'
  end

  def indicators
    [
      ManagedReports::Indicators::IncidentWorkflowBySex,
      ManagedReports::Indicators::IncidentWorkflowByAge
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::IncidentWorkflowBySex.id => 'lookup-workflow',
      ManagedReports::Indicators::IncidentWorkflowByAge.id => 'lookup-workflow'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::IncidentWorkflowBySex.id => 'lookup-gender',
      ManagedReports::Indicators::IncidentWorkflowByAge.id => 'AgeRange'
    }
  end
end
