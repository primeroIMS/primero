# frozen_string_literal: true

json.data do
  json.array! @dashboards do |dashboard|
    json.partial! 'api/v2/dashboards/dashboard', dashboard:
  end
end
