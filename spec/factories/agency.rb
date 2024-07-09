# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :agency, traits: [:active_model] do
    id { counter }
    name { "agency#{counter}" }
    unique_id { "agency-#{counter}" }
    agency_code { "AGENCY#{counter}" }
  end
end
