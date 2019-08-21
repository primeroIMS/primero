json.record_type 'case'
json.merge!({
  record_id: task.parent_case.id,
  record_id_display: task.case_id,
  type: task.type,
  priority: task.priority,
  due_date: task.due_date
}.compact!)
if task.due_date.present?
  json.merge!({
    overdue: task.overdue?,
    upcoming_soon: task.upcoming_soon?
  }.compact!)
end