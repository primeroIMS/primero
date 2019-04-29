FactoryBot.define do
  factory :location, :traits => [ :active_model ] do
    placename { "location_#{counter}"}
    location_code { "code_#{counter}"}
    admin_level 0
  end
end
