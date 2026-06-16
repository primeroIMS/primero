# frozen_string_literal: true

FactoryBot.define do
  factory :theme, traits: [:active_model] do
    site_title { 'Primero' }
    product_name { 'Primero' }
  end
end
