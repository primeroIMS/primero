puts 'Migrating (i81n): Users'

include MigrationHelper

locations = Location.all_names

User.all.each do |user|
  changed = false
  location = locations.select{|l| l[:display_text] == user.location }.first
  
  if location.present? && user.location.present?
    user.location = location['id'] 
    changed = true
  end

  user.save! if changed
end