json.data do
  json.array! @record.flags do |record|
    json.merge! record.attributes.except('id')
  end
end