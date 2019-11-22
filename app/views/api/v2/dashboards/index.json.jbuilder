json.data do
  json.array! @dashboards do |dashboard|
    json.partial! 'api/v2/dashboards/dashboard', dashboard: dashboard
  end
end