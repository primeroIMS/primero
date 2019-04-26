FactoryBot.define do
  factory :potential_match, :traits => [ :model ] do
    association :tracing_request
    association :child
    average_rating { 5.4321 }
    unique_identifier { counter.to_s }

    after(:build) do |potential_match, factory|
      PotentialMatch.stub(:get).with(potential_match.id).and_return(potential_match)
    end
  end
end
