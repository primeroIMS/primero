json.data do
  json.case @record[:case]
  json.incident @record[:incident]
  json.tracing_request @record[:tracing_request]
end