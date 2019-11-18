json.name dashboard.name
json.type dashboard.type
json.stats do
  dashboard.indicators.each do |indicator|
    json.merge! @indicator_stats[indicator.record_model.parent_form][indicator.name]
  end
end