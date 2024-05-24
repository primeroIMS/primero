# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.partial! 'api/v2/attachments/attachment',
                attachment: @attachment, updates_for_record: @updated_field_names
end
