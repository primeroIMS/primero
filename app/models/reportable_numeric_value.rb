class ReportableNumericValue < ApplicationRecord
  belongs_to :record, polymorphic: true
end
