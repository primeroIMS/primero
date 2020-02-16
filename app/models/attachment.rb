# frozen_string_literal: true

# Represents file attachments for Primero records: images, audio, documents
class Attachment < ApplicationRecord
  IMAGE = 'image'
  AUDIO = 'audio'
  DOCUMENT = 'document'

  AUDIO_CONTENT_TYPES = %w[audio/amr audio/mpeg].freeze
  IMAGE_CONTENT_TYPES = %w[image/jpg image/jpeg image/png].freeze
  DOCUMENT_CONTENT_TYPES = %w[application/pdf text/plain].freeze

  belongs_to :record, polymorphic: true, optional: true
  has_one_attached :file
  attribute :attachment, :string # This is a base64 encoded representation of the file
  attribute :file_name, :string

  validates :field_name, :attachment_type, presence: true
  validates :file,
            file_size: { less_than_or_equal_to: 10.megabytes },
            file_content_type: { allow: %w[audio/amr audio/mpeg] },
            if: :audio?
  validates :file, file_size: { less_than_or_equal_to: 2.megabytes }, if: :document?
  validates :file,
            file_size: { less_than_or_equal_to: 10.megabytes },
            file_content_type: { allow: %w[image/jpg image/jpeg image/png] },
            if: :image?
  validates_associated :record

  def attach!
    return unless record.present?
    return if file.attached?
    return unless attachment.present?

    decoded_attachment = Base64.decode64(attachment)
    io = StringIO.new(decoded_attachment)
    file.attach(io: io, filename: file_name)
    save!
  end

  def detach!
    return unless file.attached?

    file.purge
    destroy
  end

  def audio?
    attachment_type == AUDIO
  end

  def image?
    attachment_type == IMAGE
  end

  def document?
    attachment_type == DOCUMENT
  end

  def to_h_api
    hash = slice(:id, :field_name, :date, :document_description, :is_current, :comments)
    hash[:attachment_url] = Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true)
    hash
  end
end