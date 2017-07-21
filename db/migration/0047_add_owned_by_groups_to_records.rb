models = [Child, Incident, TracingRequest]

models.each do |model|
  model.each_slice do |records|
    records_to_save = []
    records.each do |record|
      if record.owner.present? && !record['owned_by_groups'].present?
        record.owned_by_groups = record.owner.try(:user_group_ids)
        records_to_save << record
        puts "#{model.to_s}: Adding owned by groups to #{record.id}"
      else
        puts "Skipping child #{record.id}"
      end
    end
    if records_to_save.present?
      model.save_all!(records_to_save)
    end
  end
end