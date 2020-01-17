json.data do
  json.array! @primero_modules do |primero_module|
    json.partial! 'api/v2/primero_modules/primero_module', primero_module: primero_module
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
