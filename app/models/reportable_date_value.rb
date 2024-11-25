class ReportableDateValue < ApplicationRecord
  belongs_to :record, polymorphic: true
end
