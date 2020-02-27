# frozen_string_literal: true

# Implements class methods for declaring attachments of type image, audio, and document
# on Records. Has idiomatic methods for handing case photos
module Attachable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  MAX_ATTACHMENTS = 100
  PHOTOS_FIELD_NAME = 'photos'

  included do
    has_many :attachments, -> { order('date DESC NULLS LAST') }, as: :record
    validate :maximum_attachments_exceeded

    searchable do
      boolean :has_photo do
        self.has_photo?
      end
    end

  end
  def has_photo
    @has_photo ||= current_photo.count.positive?
  end
  alias has_photo? has_photo
  alias photo? has_photo

  def photo
    @photo ||= current_photo.first
  end

  def photo_url
    return unless photo&.file

    Rails.application.routes.url_helpers.rails_blob_path(photo.file, only_path: true)
  end

  private

  def current_photo
    @current_photo ||= attachments.where(field_name: PHOTOS_FIELD_NAME)
  end

  def maximum_attachments_exceeded
    return unless attachments.count > (MAX_ATTACHMENTS - 1)

    errors[:attachments] << 'errors.attachments.maximum'
  end

end
