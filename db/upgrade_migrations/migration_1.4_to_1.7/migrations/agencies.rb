puts 'Migrating (i18n): Agencies'

include MigrationHelper

agency_localized_properties = Agency.localized_properties.map(&:to_s)
Agency.all.rows.map {|r| Agency.database.get(r["id"]) }.each do |agency|
  agency_localized_properties.each do |agency_prop|
    next if agency[agency_prop].blank?
    MigrationHelper.create_locales {|l| agency["#{agency_prop}_#{l}"] = agency[agency_prop] if agency["#{agency_prop}_#{l}"].blank?}
    agency.delete(agency_prop)
  end
  agency['disabled'] = (agency['disabled'] == true || agency['disabled'] == 'true')
  agency.save
end