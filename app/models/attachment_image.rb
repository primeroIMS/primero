class AttachmentImage < ApplicationRecord
  belongs_to :record, polymorphic: true, optional: true
  has_one_attached  :image

  validates :image, file_size: { less_than_or_equal_to: 10.megabytes  },
                    file_content_type: { allow: ['image/jpg', 'image/jpeg', 'image/png'] }
end
