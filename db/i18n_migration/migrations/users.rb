puts 'Migrating (i18n): Users'

include MigrationHelper

locations = Location.all_names

puts "------------------------------------------------------------------"
puts "Migrating Users..."
User.all.each do |user|
  changed = false
  location = locations.select{|l| l[:display_text] == user.location }.first
  
  if location.present? && user.location.present?
    user.location = location['id'] 
    changed = true
  end

  user.save! if changed
end