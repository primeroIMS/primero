# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class for Task
class Task
  extend ActiveModel::Naming

  attr_accessor :parent_case, :priority, :case_id, :detail, :name

  def self.from_case(records, sort_order = {})
    records = [records] unless records.is_a?(Array)
    tasks = []
    records.each do |record|
      tasks += [Tasks::AssessmentTask, Tasks::CasePlanTask, Tasks::FollowUpTask, Tasks::ServiceTask].map do |task_clazz|
        task_clazz.from_case(record)
      end.flatten
    end
    apply_order(tasks, sort_order)
  end

  # Need to use the same model name string for all tasks for i18n
  def self.model_name
    ActiveModel::Name.new(self.class, nil, 'Task')
  end

  def initialize(record)
    self.parent_case = record
    self.priority = record.risk_level
    self.case_id = record.case_id_display
    self.name = RecordDataService.visible_name(record)
  end

  def type
    self.class.name.demodulize[0..-5].underscore
  end

  def type_display(_lookups = nil)
    I18n.t("task.types.#{type}")
  end

  def overdue?
    @overdue ||= due_date < Date.today
  end

  def upcoming_soon?
    !overdue? && due_date <= 7.days.from_now
  end

  def self.apply_order(tasks, sort_order = {})
    order_field = header_map(sort_order.keys.first.to_s)
    order_by = sort_order.values.first

    return tasks.sort_by!(&:due_date) if order_field.blank? || %w[status created_at].include?(order_field)

    tasks_ordered = tasks.sort_by! { |task| task.send(order_field) || '' }
    order_by == 'desc' ? tasks_ordered.reverse! : tasks_ordered
  end

  def self.header_map(header_name)
    case header_name
    when 'record_id_display'
      'case_id'
    when 'status', 'created_at'
      'due_date'
    else
      header_name
    end
  end
end
