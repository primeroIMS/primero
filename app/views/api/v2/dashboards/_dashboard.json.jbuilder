json.name dashboard.name_i18n_key
json.type dashboard.type

json.indicators do
  json.set!(
    dashboard.indicators.map do |indicator|
      json.partial! "api/v2/dashboards/#{indicator.class.type}", indicator: indicator
    end
  )
end