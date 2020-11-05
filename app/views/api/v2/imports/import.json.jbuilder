# frozen_string_literal: true

json.data do
  json.status @import.status
  json.total @import.total
  json.file_name @import.file_name
  json.success_total @import.success_total
  json.failure_total @import.failure_total
  json.failures do
    json.array! @import.failures
  end
  json.error_messages do
    json.array! @import.error_messages
  end
end
