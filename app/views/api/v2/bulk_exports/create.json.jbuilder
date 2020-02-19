json.data do
  json.partial! 'api/v2/bulk_exports/bulk_export', bulk_export: @export
end