Incident.all.all.each do |incident|
  record_modified = false

  incident[:violations].each do |violation|
    if violation.last.present?
      violation.last.each_with_index do |v, i|
        if v[:verified] == "Pending"
          keys = ['violations', violation.first, i, 'verified']
          incident.set_value_for_attr_keys(keys, I18n.t('incident.violation.pending'))
          record_modified = true
        end
      end
    end
  end

  if record_modified
    puts "Updating: #{incident.id}"
    incident.save!
  end
end