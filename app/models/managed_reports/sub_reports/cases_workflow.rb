# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on workflow status by gender/age subreport in Primero.
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
