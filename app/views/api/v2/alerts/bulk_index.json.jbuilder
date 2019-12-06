json.data do
  json.case @alerts[:case]
  json.incident @alerts[:incident]
  json.tracing_request @alerts[:tracing_request]
end