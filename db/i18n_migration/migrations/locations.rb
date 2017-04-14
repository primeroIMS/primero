puts 'Migrating (i81n): Locations'

include MigrationHelper

locations = Location.all.rows.map {|r| Location.database.get(r["id"]) }

locations.each do |location|
  if location['hierarchy'].present?
    hierarchy = []

    location['hierarchy'].each do |h|
      location_code = locations.select{|l| l['placename'] == h}.first
      if location_code.present?
        hierarchy << location_code['location_code']
      else
        puts "No location code found or already migrated: Location - #{location['_id']} (#{h})"
      end
    end

    if hierarchy.present?
      location['hierarchy'] = hierarchy
    end
    
    MigrationHelper.create_locales do |locale|
      location["name_#{locale}"] = location['name']
    end

    location.save
  end
end