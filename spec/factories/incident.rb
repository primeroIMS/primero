FactoryGirl.define do
  factory :incident, :traits => [ :model ] do
    unique_identifier { counter.to_s }
    description { "Test Incident #{counter}" }
    created_by "test_user"
    owned_by "test_user"
    module_id "CP"

    after_build do |incident, factory|
      Incident.stub(:get).with(incident.id).and_return(incident)
    end
  end
end