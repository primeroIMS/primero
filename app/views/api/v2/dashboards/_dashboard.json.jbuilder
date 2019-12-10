json.name dashboard.name_i18n_key
json.type dashboard.type
json.stats do
  dashboard.indicators.each do |indicator|
    json.merge! @indicator_stats[indicator.record_model.parent_form][indicator.name]
  end
end