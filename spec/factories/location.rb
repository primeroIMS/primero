FactoryGirl.define do
  factory :location, :traits => [ :model ] do
    placename { "location_#{counter}"}
    location_code { "code_#{counter}"}
  end
end