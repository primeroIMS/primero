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
  }
)