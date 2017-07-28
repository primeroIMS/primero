def create_or_update_system_setting(setting_hash)
  #There should only be 1 row in system settings

  system_setting = SystemSettings.first

  if system_setting.nil?
    puts "Creating System Settings "
    SystemSettings.create! setting_hash
  else
    puts "Updating System Settings"
    system_setting.update_attributes setting_hash
  end
end

create_or_update_system_setting(
  default_locale: "en",
  reporting_location_config: {
    field_key: "owned_by_location",
    label_key: "district",
    admin_level: 2
  },
  :primary_age_range => "primero",
  :age_ranges => {
    "primero" => [0..5, 6..11, 12..17, 18..AgeRange::MAX],
    "unhcr" => [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
  },
  :show_alerts => true,
  :approval_forms_to_alert => {
    "cp_bia_form" => "bia",
    "services" => "case_plan",
    "closure_form" => "closure"
  },
  :changes_field_to_form => {
    "service_provider_details_medical_subform_section" => "service_provider_details_medical",
    "service_provider_details_psychiatric_subform_section" => "service_provider_details_psychiatric",
    "service_provider_details_psycho_social_subform_section" => "service_provider_details_psycho_social",
    "service_provider_details_social_services_subform_section" => "service_provider_details_social_services",
    "service_provider_details_judicial_subform_section" => "service_provider_details_judicial",
    "service_provider_details_forensic_subform_section" => "service_provider_details_forensic",
    "service_provider_details_legal_subform_section" => "service_provider_details_legal",
    "service_provider_details_administrative_subform_section" => "service_provider_details_administrative",
    "service_provider_details_educational_subform_section" => "service_provider_details_educational",
    "service_provider_details_economic_empowerment_subform_section" => "service_provider_details_economic_empowerment",
    "service_provider_details_other_subform_section" => "service_provider_details_other"
  }
)