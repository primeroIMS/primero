FactoryBot.define do
  factory :system_settings, :traits => [ :model ] do
    reporting_location_config {{
      field_key: "owned_by_location",
      label_key: "country",
      admin_level: 0
    }}
  end
end