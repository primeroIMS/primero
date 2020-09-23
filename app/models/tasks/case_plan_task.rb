module Tasks
  class CasePlanTask < Task
    def self.from_case(record)
      tasks = []
      if has_task?(record)
        tasks = [CasePlanTask.new(record)]
      end
      return tasks
    end

    def self.has_task?(record)
      record.case_plan_due_date.present? &&
      record.date_case_plan.blank?
    end

    def self.field_name
      'case_plan_due_date'
    end

    def due_date
      self.parent_case.case_plan_due_date
    end

    def completion_field
      'date_case_plan'
    end
  end
end
