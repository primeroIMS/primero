def create_or_update_export_config(config_hash)
  export_config_id = config_hash[:id]
  export_config = ExportConfiguration.get export_config_id

  if export_config.nil?
    puts "Creating export configuration #{export_config_id}"
    ExportConfiguration.create! config_hash
  else
    puts "Updating export configuration #{export_config_id}"
    export_config.update_attributes config_hash
  end
end


create_or_update_export_config(
  id: "export-unhcr-csv",
  name: "UNHCR CSV Export",
  export_id: "unhcr_csv",
  property_keys: [
    "individual_progress_id",
    "cpims_code",
    "date_of_identification",
    "primary_protection_concerns",
    "secondary_protection_concerns",
    "governorate_country",
    "sex",
    "date_of_birth",
    "age",
    "causes_of_separation",
    "country_of_origin",
    "current_care_arrangement",
    "reunification_status",
    "case_status"
  ]
)

create_or_update_export_config(
  id: "export-unhcr-csv-jo",
  name: "UNHCR CSV Export Jordan",
  export_id: "unhcr_csv",
  property_keys: [
    "individual_progress_id",
    "cpims_code",
    "date_of_identification",
    "primary_protection_concerns",
    "secondary_protection_concerns",
    "governorate_country",
    "sex",
    "date_of_birth",
    "age",
    "causes_of_separation",
    "country_of_origin",
    "current_care_arrangement",
    "reunification_status",
    "case_status"
  ]
)