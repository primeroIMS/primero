class AttachmentAudio < ApplicationRecord
  belongs_to :record
  has_one_attachment :audio
end
