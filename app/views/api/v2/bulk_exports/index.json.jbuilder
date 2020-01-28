json.data do
  json.array! @exports do |export|
    json.partial! 'api/v2/bulk_exports/bulk_export', bulk_export: export
  end
end

json.metadata do
  json.total @exports.total_entries
  json.per @per
  json.page @page
end