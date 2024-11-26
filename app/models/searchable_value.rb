class SearchableValue < ApplicationRecord
  belongs_to :record, polymorphic: true
end
