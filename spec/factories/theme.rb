# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :theme, traits: [:active_model] do
    site_title { 'Primero' }
    product_name { 'Primero' }
  end
end
