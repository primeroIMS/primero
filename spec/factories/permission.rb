# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  factory :permission, traits: [:model] do
    resource { Permission::CASE }
    actions do
      [
        Permission::READ,
        Permission::WRITE
      ]
    end
  end
end
