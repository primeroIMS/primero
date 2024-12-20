# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :potential_match, traits: [:model] do
    association :tracing_request
    association :child
    average_rating { 5.4321 }
    unique_identifier { counter.to_s }

    to_create { |instance| instance.save(validate: false) }
  end
end
