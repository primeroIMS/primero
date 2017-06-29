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
  :hide_alerts => false,
  :approval_form_to_alert => [
    {
      :form => "cp_bia_form",
      :alert => "bia"
    },
    {
      :form => "services",
      :alert => "case_plan"
    },
    {
      :form => "closure_form",
      :alert => "closure"
    }
  ]
)