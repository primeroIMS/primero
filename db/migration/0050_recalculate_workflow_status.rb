Child.each_slice do |records|
  records_to_save = []
  records.each do |record|
    if record.workflow == 'service_provision'
      most_recent_service = record.most_recent_service(Serviceable::SERVICE_NOT_IMPLEMENTED)
      if most_recent_service.present?
        record.workflow = most_recent_service.try(:service_response_type)
        records_to_save << record
      end
    end
  end
  if records_to_save.present?
    Child.save_all!(records_to_save)
  end
end