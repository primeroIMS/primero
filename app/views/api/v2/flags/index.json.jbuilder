json.data do
  json.array! @record.flags.order(:id) do |record|
    json.merge! record.attributes.except('id')
  end
end