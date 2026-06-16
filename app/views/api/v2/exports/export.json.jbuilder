# frozen_string_literal: true

json.data do
  json.status @export.status
  json.total @export.total
  json.export_file_name @export.file_name
  json.export_file_url url_for(@export.export_file_blob) if @export.export_file_blob.present?
  json.success_total @export.success_total
  json.failure_total @export.failure_total
  json.failures do
    json.array! @export.failures
  end
end
json.errors do
  json.array! @export.error_messages do |message|
    json.message message
  end
end
