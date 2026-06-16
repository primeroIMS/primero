# frozen_string_literal: true

json.data do
  json.unused_fields_report rails_blob_path(
    @unused_fields_report_file,
    only_path: true, expires_in: UnusedFieldsReport::EXPIRES, disposition: :attachment
  )
end
