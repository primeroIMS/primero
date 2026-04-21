# frozen_string_literal: true

# A class to store boolean values extracted from the jsonb data in records
class SearchableBoolean < ApplicationRecord
  belongs_to :record, polymorphic: true
end
