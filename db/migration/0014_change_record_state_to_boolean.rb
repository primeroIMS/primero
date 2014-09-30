def set_record_state(model)
  record_modified = false

  if model[:record_state] == 'Valid record'
    model[:record_state] = true
    record_modified = true
  elsif model[:record_state] == 'Invalid record'
    model[:record_state] = false
    record_modified = true
  end

  if record_modified
    if model.valid?
      puts "#{model.id} - #{model.class_name} is valid. (saving)"
      model.save!
    else
      puts "#{model.id} - #{model.class_name} still not valid. (not saved)"
    end
  end
end

Child.all.each do |model|
  set_record_state(model)
end

TracingRequest.all.each do |model|
  set_record_state(model)
end

Incident.all.each do |model|
  set_record_state(model)
end