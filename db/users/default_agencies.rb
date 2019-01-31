def create_or_update_agency(agency_hash)
  agency_code = agency_hash[:agency_code]
  agency = Agency.find_by agency_code: agency_code

  if agency.nil?
    puts "Creating agency #{agency_code}"
    Agency.create! agency_hash
  else
    puts "Updating agency #{agency_code}"
    agency.update_attributes agency_hash
  end

end

create_or_update_agency(
  name: "UNICEF",
  agency_code: "UNICEF"
)
