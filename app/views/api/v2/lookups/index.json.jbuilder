json.data do
  json.array! @lookups do |lookup|
    json.partial! 'api/v2/lookups/lookup', lookup: lookup
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
