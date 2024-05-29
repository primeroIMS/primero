# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.partial! 'api/v2/records/record', record: @record, selected_field_names: @updated_field_names
end
