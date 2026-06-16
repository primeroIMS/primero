# frozen_string_literal: true

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
