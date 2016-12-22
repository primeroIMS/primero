class UploadedFileWrapper
  attr_accessor :content_type
  attr_accessor :original_filename
  attr_accessor :tempfile
  attr_accessor :size
end

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
    {
      name: "DPA",
      description: "",
      order: 0,
      core_resource: true,
      agency_code: "DPA"
    }
)

create_or_update_agency(
    {
      name: "DPKO",
      description: "",
      order: 0,
      core_resource: true,
      agency_code: "DPKO"
    }
)

create_or_update_agency(
    {
      name: "MRM",
      description: "",
      order: 0,
      core_resource: true,
      agency_code: "MRM"
    }
)

create_or_update_agency(
    {
      name: "OSRSG-CAAC",
      description: "",
      order: 0,
      core_resource: true,
      agency_code: "OSRSG-CAAC"
    }
)

create_or_update_agency(
    {
      name: "UNICEF",
      description: "",
      order: 0,
      core_resource: true,
      agency_code: "UN",
    }
)

Dir[File.dirname(__FILE__) + '/agency_logos/*.png'].each do |file|
  logo = UploadedFileWrapper.new
  logo.original_filename = File.basename(file)
  logo.content_type = 'image/png'
  logo.tempfile = File.open(file)
  logo.size = logo.tempfile.size

  agency_name = logo.original_filename.split('.').first
  agency = Agency.find_by_name(agency_name)

  unless agency.nil?
    puts "Attaching logo to agency #{agency_name}"
    agency.upload_logo = {'logo' => logo}
    agency.logo_enabled = true
    if agency.save
      puts 'Successfully updated'
    else
      puts 'Encountered error!'
    end
  end
end
