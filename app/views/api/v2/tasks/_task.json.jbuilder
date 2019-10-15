json.record_type 'case'
json.merge!(
  id: task.parent_case.id,
  record_id_display: task.case_id,
  type: task.type,
  detail: task.detail,
  priority: task.priority,
  due_date: task.due_date
)
if task.due_date.present?
  json.merge!(
    overdue: task.overdue?,
    upcoming_soon: task.upcoming_soon?
  )
end
