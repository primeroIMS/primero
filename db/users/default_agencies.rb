def create_or_update_agency(agency_hash)
  agency_id = agency_hash[:id]
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
  id: "agency-unicef",
  name: "UNICEF",
  agency_code: "UN"
)
