json.data do
  json.array! @locations do |location|
    json.partial! 'api/v2/locations/location', location: location, with_hierarchy: @with_hierarchy
  end
end