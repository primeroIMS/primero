[Child, Incident, TracingRequest].each do |model|
  date_fields = Field.all_searchable_date_field_names(model.parent_form)

  model.all.all.each do |record|
    date_fields.each do |field|
      value = record.send(field)
      if !value.nil? && !value.present?
        record[field] = nil
      end
      record.save
    end
  end

end
