# frozen_string_literal: true

module Tasks
  # Class for Follow Up Task
  class FollowUpTask < Task
    attr_accessor :followup

    def self.from_case(record)
      tasks = []
      if record.followup_subform_section.present?
        record.followup_subform_section.each do |followup|
          tasks << FollowUpTask.new(record, followup) if task?(followup)
        end
      end
      tasks.select { |task| task.due_date.present? }
    end

    def self.task?(followup)
      followup['followup_needed_by_date'].present? && followup['followup_date'].blank?
    end

    def self.field_name
      'followup_needed_by_date'
    end

    def initialize(record, followup)
      super(record)
      self.followup = followup
      self.detail = followup['followup_type']
    end

    def due_date
      followup['followup_needed_by_date']
    end

    def type_display(lookups = nil)
      I18n.t("task.types.#{type}",
             subtype: Lookup.display_value('lookup-followup-type', followup['followup_type'], lookups))
    end

    def completion_field
      'followup_date'
    end
  end
end
