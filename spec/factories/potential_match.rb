# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :potential_match, traits: [:model] do
    association :tracing_request
    association :child
    average_rating { 5.4321 }
    unique_identifier { counter.to_s }

    after(:build) do |potential_match, _factory|
      PotentialMatch.stub(:get).with(potential_match.id).and_return(potential_match)
    end
  end
end
