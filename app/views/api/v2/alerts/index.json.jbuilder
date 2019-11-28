json.data do
  json.array! @alert.order(:id) do |alert|
    json.partial! 'api/v2/alerts/alert', alert: alert
  end
end