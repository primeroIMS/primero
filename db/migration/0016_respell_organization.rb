[Child, Incident, TracingRequest].each do |model|
  model.all.all.each do |record|
    record.created_organization = record['created_organisation']
    record.delete 'created_organisation'
    record.save
  end
end
