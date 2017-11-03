FactoryGirl.define do
  factory :system_settings, :traits => [ :model ] do
    reporting_location_config {{
      field_key: "owned_by_location",
      label_key: "country",
      admin_level: 0
    }}
  end

  factory :system_users do
    name 'test_user'
    password 'test_password'
    type 'user'
    roles ["admin"]
  end
end