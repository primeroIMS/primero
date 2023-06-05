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

  def indicators_rows
    workflow_statuses = FieldI18nService.convert_options(
      Child.workflow_statuses([PrimeroModule.find_by(unique_id: PrimeroModule::CP)])
    )

    {
      ManagedReports::Indicators::CaseWorkflowBySex.id => workflow_statuses,
      ManagedReports::Indicators::CaseWorkflowByAge.id => workflow_statuses
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::CaseWorkflowBySex.id => 'lookup-gender',
      ManagedReports::Indicators::CaseWorkflowByAge.id => 'AgeRange'
    }
  end
end
