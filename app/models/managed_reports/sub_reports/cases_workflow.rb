# frozen_string_literal: true

# Describes Attack on schools subreport in Primero.
class ManagedReports::SubReports::CasesWorkflow < ManagedReports::SubReport
  def id
    'cases_workflow'
  end

  def indicators
    [
      ManagedReports::Indicators::CaseWorkflowBySex,
      ManagedReports::Indicators::CaseWorkflowByAge
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::CaseWorkflowBySex.id => 'lookup-workflow',
      ManagedReports::Indicators::CaseWorkflowByAge.id => 'lookup-workflow'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::CaseWorkflowBySex.id => 'lookup-gender',
      ManagedReports::Indicators::CaseWorkflowByAge.id => 'AgeRange'
    }
  end
end
