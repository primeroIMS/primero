json.data do
  json.array! @records do |record|
    json.partial! 'child', record: record, selected_field_names: @selected_field_names
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
