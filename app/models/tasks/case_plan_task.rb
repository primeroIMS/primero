# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Tasks
  # Class for Case Plan Task
  class CasePlanTask < Task
    # rubocop:enable Style/ClassAndModuleChildren
    def self.from_case(record)
      task?(record) ? [CasePlanTask.new(record)] : []
    end

    def self.task?(record)
      record.case_plan_due_date.present? && record.date_case_plan.blank?
    end

    def self.field_name
      'case_plan_due_date'
    end

    def due_date
      parent_case.case_plan_due_date
    end

    def completion_field
      'date_case_plan'
    end
  end
end
