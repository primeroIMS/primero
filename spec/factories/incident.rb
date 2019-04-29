FactoryBot.define do
  factory :incident, :traits => [ :record ] do
    unique_identifier { counter.to_s }
    data do
     {
       description: "Test Incident #{counter}",
       created_by: "test_user",
       owned_by: "test_user",
       module_id: "CP"
     }
    end
    after(:build) do |incident, factory|
      Incident.stub(:find).with(incident.id).and_return(incident)
      Incident.stub(:find_by).with({id: incident.id}).and_return(incident)
    end
  end
end