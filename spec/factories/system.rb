FactoryGirl.define do
  factory :system_settings, :traits => [ :model ] do
    default_locale "en"
    primary_age_range "primero"
    age_ranges {{
      "primero" => [ 0..5, 6..11, 12..17, 18..AgeRange::MAX ]
    }}
    show_alerts true
  end

  factory :system_users do
    name 'test_user'
    password 'test_password'
    type 'user'
    roles ["admin"]
  end
end