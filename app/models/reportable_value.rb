class ReportableValue < ApplicationRecord
  belongs_to :record, polymorphic: true
end
