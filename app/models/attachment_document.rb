class AttachmentDocument < ApplicationRecord
  belongs_to :record, polymorphic: true, optional: true
  has_one_attached :document

  validates :document, file_size: { less_than_or_equal_to: 2.megabytes  }
end
