# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/records/record', record: @incident, selected_field_names: @selected_field_names
end
