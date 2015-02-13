def create_or_update_agency(agency_hash)
  agency_id = Agency.id_from_name(agency_hash[:name])
  agency = Agency.get(agency_id)

  if agency.nil?
    puts "Creating agency #{agency_id}"
    Agency.create! agency_hash
  else
    puts "Updating agency #{agency_id}"
    agency.update_attributes agency_hash
  end

end

create_or_update_agency(
  name: "UNICEF"
)