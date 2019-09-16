json.array! flags.where.not('removed').order(:id) do |record|
  json.merge! record.attributes
  json.record_type request.path.split('/')[3]
end