FactoryBot.define do
  factory :tracing_request, :traits => [ :model ] do
    unique_identifier { counter.to_s }
    enquirer_name { "Test Tracing Request #{counter}" }
    created_by { "test_user" }
    owned_by { "test_user" }
    module_id { "CP" }

    after(:build) do |tracing_request, factory|
      TracingRequest.stub(:get).with(tracing_request.id).and_return(tracing_request)
    end
  end
end
