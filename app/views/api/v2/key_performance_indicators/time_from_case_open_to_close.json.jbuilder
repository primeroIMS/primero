json.data do
  json.array! @results do |delay, total_cases|
    json.time delay
    json.percent total_cases.to_f / @total
  end
end
