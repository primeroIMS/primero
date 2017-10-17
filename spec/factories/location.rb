FactoryGirl.define do
  factory :location, :traits => [ :model ] do
    placename { "location_#{counter}"}
    location_code { "code_#{counter}"}
  end

  after(:build) do |incident, factory|
    Location.stub(:all_names).and_return([{"id"=>"51227", "display_text"=>"Test::Location"}])
  end
end