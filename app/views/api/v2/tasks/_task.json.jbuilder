# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.record_type 'case'
json.merge!(
  id: task.parent_case.id,
  record_id_display: task.case_id,
  type: task.type,
  detail: task.detail,
  priority: task.priority,
  # TODO:  should display the localized due_date represented by the datetime value
  due_date: task.due_date.strftime('%d-%b-%Y'),
  type_display: task.type_display,
  name: task.name,
  completion_field: task.completion_field,
  module_unique_id: task.parent_case.module_id
)
if task.due_date.present?
  json.merge!(
    overdue: task.overdue?,
    upcoming_soon: task.upcoming_soon?
  )
end
