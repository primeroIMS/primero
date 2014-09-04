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
  name: "German Technical Cooperation"
)
create_or_update_agency(
  name: "GTZ"
)
create_or_update_agency(
  name: "ICRC"
)
create_or_update_agency(
  name: "International Rescue Committee"
)
create_or_update_agency(
  name: "IRC"
)
create_or_update_agency(
  name: "IRC K"
)
create_or_update_agency(
  name: "IRC KV"
)
create_or_update_agency(
  name: "IRC Legal"
)
create_or_update_agency(
  name: "IRC NH"
)
create_or_update_agency(
  name: "IRC NZ"
)
create_or_update_agency(
  name: "IRC NZV"
)
create_or_update_agency(
  name: "Save the Children"
)
create_or_update_agency(
  name: "SCUK"
)
create_or_update_agency(
  name: "SCUK-LF"
)
create_or_update_agency(
  name: "SCUK-MOT"
)
create_or_update_agency(
  name: "UNICEF"
)
create_or_update_agency(
  name: "United Nations Childrens Fund"
)