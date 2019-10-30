puts 'Migrating (i18n): Users'

include MigrationHelper

locations = MigrationHelper.get_locations

    puts "------------------------------------------------------------------"
    puts "Migrating Users..."
    records_to_save = []
    User.all.each do |user|
      next if user.location.blank?
      location = locations.select{|l| l[:display_text] == user.location}.first
      if location.present? && user.location.present?
        user.location = location['id']
        records_to_save << user
      end
    end

    if records_to_save.present?
      puts "Updating #{records_to_save.count} users"
      User.save_all!(records_to_save)
    end