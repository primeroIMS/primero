json.data do
  json.array! @results do |delay, number_of_incidents|
    json.delay delay
    json.total_incidents number_of_incidents
    json.percentage number_of_incidents.to_f / @total
  end
end
