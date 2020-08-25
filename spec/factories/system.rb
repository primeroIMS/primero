FactoryBot.define do
  factory :system_settings, :traits => [ :active_model ] do
    reporting_location_config {{
      field_key: "owned_by_location",
      admin_level: 2,
      admin_level_map: { '1' => ['province'], '2' => ['district'] }
    }}
  end
end