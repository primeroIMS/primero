# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @incidents do |incident|
    json.partial! 'api/v2/records/record', record: incident, selected_field_names: @selected_field_names
  end
end
