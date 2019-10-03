module Tasks
  class FollowUpTask < Task
    attr_accessor :followup

    def self.from_case(record)
      tasks = []
      if record.followup_subform_section.present?
        record.followup_subform_section.each do |followup|
          if has_task?(followup)
            tasks << FollowUpTask.new(record, followup)
          end
        end
      end
      tasks.select{ |task| task.due_date.present? }
    end

    def self.has_task?(followup)
      followup['followup_needed_by_date'].present? &&
      !followup['followup_date'].present?
    end

    def initialize(record, followup)
      super(record)
      self.followup = followup
      self.detail = followup['followup_type']
    end

    def due_date
      self.followup['followup_needed_by_date']
    end

    def type_display(lookups=nil)
      I18n.t("task.types.#{self.type}",
            subtype:  Lookup.display_value('lookup-followup-type', followup['followup_type'], lookups))
    end
  end
end