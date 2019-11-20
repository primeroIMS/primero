json.data do
  json.array! @locations do |location|
    json.partial! 'api/v2/locations/location', location: location, with_hierarchy: @with_hierarchy
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
