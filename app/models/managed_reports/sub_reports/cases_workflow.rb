# frozen_string_literal: true

# Describes Attack on schools subreport in Primero.
class ManagedReports::SubReports::CasesWorkflow < ManagedReports::SubReport
  def id
    'cases_workflow'
  end

  def indicators
    [
      ManagedReports::Indicators::CaseWorkflowBySexAndAge
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::CaseWorkflowBySexAndAge.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::CaseWorkflowBySexAndAge.id => 'AgeRange'
    }
  end
end
