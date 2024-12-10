# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class to store boolean values extracted from the jsonb data in records
class SearchableBoolean < ApplicationRecord
  belongs_to :record, polymorphic: true
end
