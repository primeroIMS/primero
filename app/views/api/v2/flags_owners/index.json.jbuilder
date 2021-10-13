# frozen_string_literal: true

json.data do
  json.array! @flags do |flag|
    json.partial! 'api/v2/flags/flag', flag: flag
  end
end
