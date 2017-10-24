class Task

  attr_accessor :parent_case, :priority, :case_id

  def self.from_case(records)
    records = [records] unless records.is_a?(Array)
    tasks = []
    records.each do |record|
      tasks += [AssessmentTask, CasePlanTask, FollowUpTask, ServiceTask].map do |task_clazz|
        task_clazz.from_case(record)
      end.flatten
    end
    tasks.sort_by!(&:due_date)
  end

  def initialize(record)
    self.parent_case = record
    self.priority = record.try(:risk_level)
    self.case_id = record.case_id_display
  end

  def type
    self.class.name[0..-5].underscore
  end

  def type_display(lookups=nil)
    I18n.t("task.types.#{self.type}")
  end

  def overdue?
    self.due_date < Date.today
  end

  def upcoming_soon?
    !self.overdue? && self.due_date <= 7.days.from_now
  end

end

class AssessmentTask < Task
  def self.from_case(record)
    tasks = []
    if has_task?(record)
      tasks = [AssessmentTask.new(record)]
    end
    return tasks
  end

  def self.has_task?(record)
    record.try(:assessment_due_date).present? &&
    !record.try(:assessment_requested_on).present?
  end

  def due_date
    self.parent_case.assessment_due_date
  end
end

class CasePlanTask < Task
  def self.from_case(record)
    tasks = []
    if has_task?(record)
      tasks = [CasePlanTask.new(record)]
    end
    return tasks
  end

  def self.has_task?(record)
    record.try(:case_plan_due_date).present? &&
    !record.try(:date_case_plan).present?
  end

  def due_date
    self.parent_case.case_plan_due_date
  end
end

class FollowUpTask < Task
  attr_accessor :followup

  def self.from_case(record)
    tasks = []
    if record.try(:followup_subform_section).present?
      record.followup_subform_section.each do |followup|
        if has_task?(followup)
          tasks << FollowUpTask.new(record, followup)
        end
      end
    end
    tasks
  end

  def self.has_task?(followup)
    followup.try(:followup_needed_by_date).present? &&
    !followup.try(:followup_date).present?
  end

  def initialize(record, followup)
    super(record)
    self.followup = followup
  end

  def due_date
    self.followup.followup_needed_by_date
  end

  def type_display(lookups=nil)
    I18n.t("task.types.#{self.type}",
           subtype:  Lookup.display_value('lookup-followup-type', followup.try(:followup_type), lookups))
  end
end

class ServiceTask < Task
  attr_accessor :service

  def self.from_case(record)
    tasks = []
    if record.try(:services_section).present?
      record.services_section.each do |service|
        if has_task?(service)
          tasks << ServiceTask.new(record, service)
        end
      end
    end
    tasks
  end

  def self.has_task?(service)
    #TODO: or should use service.try(:service_implemented) == Child::SERVICE_NOT_IMPLEMENTED
    service.try(:service_appointment_date).present? &&
    !service.try(:service_implemented_day_time).present?
  end

  def initialize(record, service)
    super(record)
    self.service = service
  end

  def due_date
    self.service.service_appointment_date
  end

  def type_display(lookups=nil)
    I18n.t("task.types.#{self.type}",
           subtype:  Lookup.display_value('lookup-service-type', service.try(:service_type), lookups))
  end
end
