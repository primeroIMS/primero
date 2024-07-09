# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FactoryBot.define do
  trait :active_model do
    transient do
      sequence(:counter, 1_000_000)
    end

    id { counter }
  end
end
