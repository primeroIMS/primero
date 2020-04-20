# frozen_string_literal: true

# Represents file attachments for Primero records: images, audio, documents
class Attachment < ApplicationRecord
  IMAGE = 'image'
  AUDIO = 'audio'
  DOCUMENT = 'document'

  AUDIO_CONTENT_TYPES = %w[audio/amr audio/mpeg].freeze
  IMAGE_CONTENT_TYPES = %w[image/jpg image/jpeg image/png].freeze
  DOCUMENT_CONTENT_TYPES = %w[application/pdf text/plain].freeze

  MAX_SIZE = 4.megabytes.freeze
  EXPIRES = 60.seconds # Expiry for the delegated ActiveStorage url

  belongs_to :record, polymorphic: true, optional: true
  has_one_attached :file
  attribute :attachment, :string # This is a base64 encoded representation of the file
  attribute :file_name, :string
  attribute :content_type, :string

  validates :field_name, presence: true
  validates :attachment_type, presence: true, inclusion: { in: [IMAGE, AUDIO, DOCUMENT] }
  validates :file,
            file_size: { less_than_or_equal_to: MAX_SIZE },
            file_content_type: { allow: ->(a) { a.valid_content_types } },
            if: :attached?
  validates_associated :record
  after_save :index_record

  def attach
    return unless record.present?
    return if attached?
    return unless attachment.present?

    decoded_attachment = Base64.decode64(attachment)
    io = StringIO.new(decoded_attachment)
    file.attach(io: io, filename: file_name, content_type: content_type) || true
  end

  def attach!
    attach && save!
  end

  def detach
    return unless attached?

    file.purge || true
  end

  def detach!
    detach && destroy
  end

  def attached?
    file.attached?
  end

  def file_name
    self[:file_name] || file&.filename&.to_s
  end

  def content_type
    self[:content_type] || (file.attachment && file&.content_type&.to_s)
  end

  def valid_content_types
    case attachment_type
    when AUDIO
      AUDIO_CONTENT_TYPES
    when DOCUMENT
      DOCUMENT_CONTENT_TYPES
    when IMAGE
      IMAGE_CONTENT_TYPES
    else
      []
    end
  end

  def url
    Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true, expires_in: EXPIRES)
  end

  def to_h_api
    hash = slice(:id, :field_name, :file_name, :date, :description, :is_current, :comments)
    hash[:attachment_url] = url
    hash
  end

  def index_record
    Sunspot.index!(record) if record
  end
end
