# frozen_string_literal: true

json.data do
  json.array! @tasks do |task|
    json.partial! 'api/v2/tasks/task', task: task
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
  json.field_names do
    json.assessment Tasks::AssessmentTask.field_name
    json.case_plan Tasks::CasePlanTask.field_name
    json.service Tasks::ServiceTask.field_name
    json.follow_up Tasks::FollowUpTask.field_name
  end
end
