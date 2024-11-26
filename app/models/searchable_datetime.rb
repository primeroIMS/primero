class SearchableDatetime < ApplicationRecord
  belongs_to :record, polymorphic: true
end
