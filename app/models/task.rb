class Task
  extend ActiveModel::Naming

  attr_accessor :parent_case, :priority, :case_id, :detail, :name

  def self.from_case(records)
    records = [records] unless records.is_a?(Array)
    tasks = []
    records.each do |record|
      tasks += [Tasks::AssessmentTask, Tasks::CasePlanTask, Tasks::FollowUpTask, Tasks::ServiceTask].map do |task_clazz|
        task_clazz.from_case(record)
      end.flatten
    end
    tasks.sort_by!(&:due_date)
  end

  #Need to use the same model name string for all tasks for i18n
  def self.model_name
    ActiveModel::Name.new(self.class, nil, 'Task')
  end

  def initialize(record)
    self.parent_case = record
    self.priority = record.risk_level
    self.case_id = record.case_id_display
    self.name = record.hidden_name.present? ? '*******' : record.name
  end

  def type
    self.class.name.demodulize[0..-5].underscore
  end

  def type_display(lookups=nil)
    I18n.t("task.types.#{self.type}")
  end

  def overdue?
    @overdue ||= self.due_date < Date.today
  end

  def upcoming_soon?
    !self.overdue? && self.due_date <= 7.days.from_now
  end

end
