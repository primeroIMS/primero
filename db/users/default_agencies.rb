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

#TODO - ADD LOGOS

create_or_update_agency(
    {
      name: "DPA",
      description: "",
      disabled: "",
      order: 0,
      logo_enabled: false,
      core_resource: false,
      agency_code: "DPA",
      logo_key: "DPA_logo",
    }
)

create_or_update_agency(
    {
      name: "DPKO",
      description: "",
      disabled: "",
      order: 0,
      logo_enabled: false,
      core_resource: false,
      agency_code: "DPKO",
      logo_key: "dpko_logo",
    }
)

create_or_update_agency(
    {
      name: "MRM",
      description: "",
      disabled: "",
      order: 0,
      logo_enabled: false,
      core_resource: false,
      agency_code: "MRM",
      logo_key: "MRMIMS_logo",
    }
)

create_or_update_agency(
    {
      name: "OSRSG-CAAC",
      description: "",
      disabled: "",
      order: 0,
      logo_enabled: false,
      core_resource: false,
      agency_code: "OSRSG-CAAC",
      logo_key: "OSRSG_logo",
    }
)

create_or_update_agency(
    {
      name: "UNICEF",
      description: "",
      disabled: "",
      order: 0,
      logo_enabled: false,
      core_resource: false,
      agency_code: "UN",
      logo_key: "unicef_logo",
    }
)
