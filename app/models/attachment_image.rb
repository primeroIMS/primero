class AttachmentImage < ApplicationRecord
  belongs_to :record
  has_one_attached  :image
end
