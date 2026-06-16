# frozen_string_literal: true

# A class to store numeric values extracted from the jsonb data in records
class SearchableNumeric < ApplicationRecord
  belongs_to :record, polymorphic: true
end
