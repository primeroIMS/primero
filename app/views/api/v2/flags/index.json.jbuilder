json.data do
  json.array! @record.flags.order(:id) do |record|
    json.merge! record.attributes
    json.record_type request.path.split('/')[3]
  end
end