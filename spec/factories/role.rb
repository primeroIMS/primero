# frozen_string_literal: true

FactoryBot.define do
  factory :role, traits: [:active_model] do
    name { "test_role_#{counter}" }
    description { 'test description' }
    permissions { Permission.all_available }
    primero_modules { [FactoryBot.create(:primero_module)] }
    user_category { nil }
  end
end
