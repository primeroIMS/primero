json.errors do
  json.array! @errors do |error|
    json.status error.code
    json.resource error.resource
    json.message error.message
  end
end
