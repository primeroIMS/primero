report_hash = {
  id: report.id,
  name: report.name_i18n,
  description: report.description_i18n,
  graph: report.is_graph,
  graph_type: 'bar'
}.as_json

json.merge! complete_locales_for([:name, :description], report_hash)
if report.values.present?
  horizontal_fields = report.aggregate_by
                            .each_with_index
                            .map { |f,i| report_field(report.field_map[f], 'horizontal', i, f) }
                            .map { |rf| complete_locales_for([:display_name], rf.as_json) }
  vertical_fields = report.disaggregate_by
                          .each_with_index
                          .map { |f,i| report_field(report.field_map[f], 'vertical', i, f) }
                          .map { |rf| complete_locales_for([:display_name], rf.as_json) }
  json.merge!({
    fields: horizontal_fields + vertical_fields,
    report_data: report.hashed_values
  })
end