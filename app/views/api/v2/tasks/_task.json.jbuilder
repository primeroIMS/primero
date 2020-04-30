json.record_type 'case'
json.merge!(
  id: task.parent_case.id,
  record_id_display: task.case_id,
  type: task.type,
  detail: task.detail,
  priority: task.priority,
  # TODO:  should display the localized due_date represented by the datetime value
  due_date: task.due_date.strftime("%d-%b-%Y"),
  type_display: task.type_display,
  name: task.name
)
if task.due_date.present?
  json.merge!(
    overdue: task.overdue?,
    upcoming_soon: task.upcoming_soon?
  )
end
