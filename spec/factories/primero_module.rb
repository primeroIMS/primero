# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :primero_module, traits: [:active_model] do
    id { counter }
    name { "test_module_#{counter}" }
    description { 'test description' }
    association :primero_program, factory: :primero_program, strategy: :build
    associated_record_types { %w[case incident] }
    form_sections { [FactoryBot.create(:form_section)] }
  end
end
