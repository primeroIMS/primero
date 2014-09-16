#Throw out all violations where the only value set is 'verified'

incidents = Incident.all

incidents.each do |incident|
  if incident.violations.present?
    incident.violations.to_hash.each do |key, value|      
      value.reject!{|v| v.to_hash.values.count(&:present?) == 1 && v.verified == 'Pending'}
    end
    if incident.valid?
      puts "saving incident #{incident.short_id}"
      incident.save!
    else
      puts "incident #{incident.short_id} not valid, not saving"
    end
  end
  
end
