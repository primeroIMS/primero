# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :primero_program, traits: [:active_model] do
    name { "test_program_#{counter}" }
    description { 'test description' }
  end
end
