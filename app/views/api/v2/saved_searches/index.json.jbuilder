json.data do
  json.array! @saved_searches do |saved_search|
    json.partial! 'api/v2/saved_searches/saved_search', saved_search: saved_search
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end