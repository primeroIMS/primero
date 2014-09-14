[Child, Incident, TracingRequest].each do |model|
  date_fields = Field.all_searchable_date_field_names(model.parent_form).uniq

  model.all.all.each do |record|
    #puts record.id
    date_fields.each do |field|
      value = record.send(field)
      if !value.nil? && !value.present?
        record[field] = nil
        #puts field
      end
    end
    record.save
  end

end
