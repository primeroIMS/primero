# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :lookup, class: Lookup, traits: [:active_model] do
    name { "test_lookup_#{counter}" }
    lookup_values_en do
      [
        { id: 'province', display_text: 'Province' },
        { id: 'district', display_text: 'District' }
      ]
    end
  end
end
