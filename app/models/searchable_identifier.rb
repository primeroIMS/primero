# frozen_string_literal: true

# Class for SearchableIdentifier
class SearchableIdentifier < ApplicationRecord
  belongs_to :record, polymorphic: true
end
