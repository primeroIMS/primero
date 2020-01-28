# frozen_string_literal: true

json.data do
  json.array! @alerts do |alert|
    json.partial! 'api/v2/alerts/alert', alert: alert
  end
end