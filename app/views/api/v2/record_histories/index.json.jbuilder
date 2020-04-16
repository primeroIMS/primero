# frozen_string_literal: true

json.data do
  json.array! @record_histories do |record_history|
    json.record_id @record.id
    json.record_type record_history.record_type
    json.datetime record_history.datetime&.iso8601
    json.user_name record_history.user_name
    json.action record_history.action
    json.record_changes (record_history.record_changes.map { |key, value| { key => value } })
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
