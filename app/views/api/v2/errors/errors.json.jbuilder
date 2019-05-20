json.errors do
  json.array! @errors do |error|
    json.status error.code
    json.resource error.resource
    json.detail error.detail if error.detail.present?
    json.message error.message
  end
end
