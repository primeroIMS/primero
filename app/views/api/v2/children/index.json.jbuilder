json.data do
  json.array! @records do |record|
    json.id record.id
    json.merge! record.data.compact.select{|k,_| @selected_field_names.include?(k)}.to_h
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
