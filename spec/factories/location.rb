# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :location, traits: [:active_model] do
    placename { "location_#{counter}" }
    location_code { "code_#{counter}" }
  end
end
