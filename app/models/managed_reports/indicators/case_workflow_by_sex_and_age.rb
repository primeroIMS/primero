# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by workflow and sex
class ManagedReports::Indicators::CaseWorkflowBySexAndAge < ManagedReports::Indicators::FieldByAgeSex
  class << self
    def id
      'case_workflow_by_sex_and_age'
    end

    def field_name
      'workflow'
    end
  end
end
