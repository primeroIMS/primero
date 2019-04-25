class AttachmentDocument < ApplicationRecord
  belongs_to :record, polymorphic: true, optional: true
  has_one_attached :document
end
