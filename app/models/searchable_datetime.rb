# frozen_string_literal: true

# A class to store datetime values extracted from the jsonb data in records
class SearchableDatetime < ApplicationRecord
  belongs_to :record, polymorphic: true
end
