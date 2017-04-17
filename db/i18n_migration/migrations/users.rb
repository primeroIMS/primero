include MigrationHelper

locations = Location.all_names

User.all.each do |user|
  changed = false

  location = locations.select{|l| l[:name] == user.location }.first
  
  if location.present? && user.location.present?
    user.location = location[:location_code] 
    changed = true
  end

  user.save! if changed
end