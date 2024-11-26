class SearchableNumeric < ApplicationRecord
  belongs_to :record, polymorphic: true
end
