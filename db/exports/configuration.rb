def create_or_update_export_config(config_hash)
  export_config_id = config_hash[:unique_id]
  export_config = ExportConfiguration.find_by(unique_id: export_config_id)

  if export_config.nil?
    puts "Creating export configuration #{export_config_id}"
    ExportConfiguration.create! config_hash
  else
    puts "Updating export configuration #{export_config_id}"
    export_config.update_attributes config_hash
  end
end


create_or_update_export_config(
  unique_id: "export-unhcr-csv",
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
  ],
  opt_out_field: 'unhcr_export_opt_out',
  property_keys_opt_out: ["cpims_code"]
)

create_or_update_export_config(
  unique_id: "export-unhcr-csv-jo",
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
  ],
  opt_out_field: 'unhcr_export_opt_out',
  property_keys_opt_out: ["cpims_code"]
)

create_or_update_export_config(
    unique_id: "export-duplicate-id-csv",
    name: "Duplicate ID CSV Export",
    export_id: "duplicate_id_csv",
    property_keys: [
        "national_id_no",
        "child_name_last_first",
        "progress_id",
        "age",
        "sex",
        "family_size",
        "case_id"
    ]
)
