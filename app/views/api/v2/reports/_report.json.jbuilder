fields = ReportFieldService.horizontal_fields(report) + ReportFieldService.vertical_fields(report)

report_hash = FieldI18nService.fill_keys([:name, :description], {
  id: report.id,
  name: report.name_i18n,
  description: report.description_i18n,
  graph: report.is_graph,
  graph_type: 'bar',
  fields: fields.map { |f| FieldI18nService.fill_keys([:display_name], f) },
})

json.merge!(report_hash)
json.merge!({ report_data: report.values_as_json_hash }) if report.values.present?