json.data do
  json.array! @records do |record|
    json.id record.id
    json.merge! record.data.compact
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
