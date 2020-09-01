# frozen_string_literal: true

json.data do
  json.array! @configurations do |configuration|
    json.partial! 'api/v2/primero_configurations/configuration', configuration: configuration
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
