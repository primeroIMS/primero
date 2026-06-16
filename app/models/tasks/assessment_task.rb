# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
module Tasks
  # Class for Assessment Task
  class AssessmentTask < Task
    # rubocop:enable Style/ClassAndModuleChildren
    def self.from_case(record)
      task?(record) ? [AssessmentTask.new(record)] : []
    end

    def self.task?(record)
      record.assessment_due_date.present? && record.assessment_requested_on.blank?
    end

    def self.field_name
      'assessment_due_date'
    end

    def due_date
      parent_case.assessment_due_date
    end

    def completion_field
      'assessment_requested_on'
    end
  end
end
