# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/attachments/attachment',
                attachment: @attachment, updates_for_record: @updated_field_names
end