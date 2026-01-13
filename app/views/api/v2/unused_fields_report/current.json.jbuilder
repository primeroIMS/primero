# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.unused_fields_report rails_blob_path(
    @unused_fields_report_file,
    only_path: true, expires_in: UnusedFieldsReport::EXPIRES, disposition: :attachment
  )
end
