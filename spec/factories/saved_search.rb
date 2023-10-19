# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :saved_search, traits: [:model] do
    name { "saved_search_#{counter}" }
    user_name { 'zuul' }
  end
end
