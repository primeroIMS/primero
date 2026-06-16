# frozen_string_literal: true

json.data do
  json.array! @record.flags.order(:id) do |flag|
    json.partial! 'api/v2/flags/flag', flag:
  end
end
