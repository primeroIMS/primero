puts 'Migrating (i81n): Locations'

include MigrationHelper

locations = Location.all.rows.map {|r| Location.database.get(r["id"]) }

lookup_values = [
  {id: "country", display_text: "Country"}.with_indifferent_access,
  {id: "region", display_text: "Region"}.with_indifferent_access,
  {id: "province", display_text: "Province"}.with_indifferent_access,
  {id: "district", display_text: "District"}.with_indifferent_access,
  {id: "governorate", display_text: "Governorate"}.with_indifferent_access,
  {id: "chiefdom", display_text: "Chiefdom"}.with_indifferent_access,
  {id: "state", display_text: "State"}.with_indifferent_access,
  {id: "city", display_text: "City"}.with_indifferent_access,
  {id: "county", display_text: "County"}.with_indifferent_access,
  {id: "camp", display_text: "Camp"}.with_indifferent_access,
  {id: "site", display_text: "Site"}.with_indifferent_access,
  {id: "village", display_text: "Village"}.with_indifferent_access,
  {id: "zone", display_text: "Zone"}.with_indifferent_access,
  {id: "sub_district", display_text: "Sub District"}.with_indifferent_access,
  {id: "locality", display_text: "Locality"}.with_indifferent_access,
  {id: "other", display_text: "Other"}.with_indifferent_access
]

locations.each do |location|
  type = lookup_values.select{|lv| lv[:id] == location['type']}.first

  unless type.present?
    lookup_values << {id: location['type'], display_text: location['type'].titleize}.with_indifferent_access 
  end

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

MigrationHelper.create_or_update_lookup(
  :id => "lookup-location-type",
  :name => "Location Type",
  :locked => true,
  :lookup_values => lookup_values
)