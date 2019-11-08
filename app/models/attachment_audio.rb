class AttachmentAudio < ApplicationRecord
  belongs_to :record, polymorphic: true, optional: true
  has_one_attached :audio

  validates :audio, file_size: { less_than_or_equal_to: 10.megabytes },
                    file_content_type: { allow: ['audio/amr', 'audio/mpeg'] }
end
