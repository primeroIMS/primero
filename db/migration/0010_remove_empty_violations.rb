#Throw out all violations where the only value set is 'verified'

incidents = Incident.all
failure_occured = false

incidents.each do |incident|
  if incident.violations.present?
    incident.violations.to_hash.each do |key, value|      
      value.reject!{|v| v.to_hash.values.count(&:present?) == 1 && v.verified == 'Pending'}
    end
    begin
      puts "saving incident #{incident.short_id}"
      incident.save!
    rescue => e
      puts "incident #{incident.short_id} not valid, not saving"
      puts e.inspect
      failure_occured = true
    end
  end
end

if failure_occured
  raise "Migration 0010 failed"
end
