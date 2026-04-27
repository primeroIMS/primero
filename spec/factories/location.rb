# frozen_string_literal: true

FactoryBot.define do
  factory :location, traits: [:active_model] do
    placename { "location_#{counter}" }
    location_code { "code_#{counter}" }
  end
end
