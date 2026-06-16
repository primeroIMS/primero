# frozen_string_literal: true

# A class to store string values extracted from the jsonb data in records
class SearchableValue < ApplicationRecord
  belongs_to :record, polymorphic: true
end
