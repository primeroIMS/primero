json.data do
  json.array! @results do |delay, total_cases|
    json.delay delay
    json.total_incidents total_cases
    json.percentage total_cases.to_f / @total
  end
end
