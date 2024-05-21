# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Implements class methods for declaring attachments of type image, audio, and document
# on Records. Has idiomatic methods for handing case photos
module Attachable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  PHOTOS_FIELD_NAME = 'photos'
  AUDIOS_FIELD_NAME = 'recorded_audio'
  DOCUMENTS_FIELD_NAME = 'other_documents'

  included do
    has_many :attachments, -> { order('date DESC NULLS LAST') }, as: :record
    has_many :current_photos, -> { where(field_name: PHOTOS_FIELD_NAME).order('date DESC NULLS LAST') },
             as: :record, class_name: 'Attachment'
    has_many :current_audios, -> { where(field_name: AUDIOS_FIELD_NAME).order('date DESC NULLS LAST') },
             as: :record, class_name: 'Attachment'

    store_accessor(:data, :has_photo)

    before_save :calculate_has_photo
  end

  def photo?
    has_photo
  end

  alias has_photo? photo?

  def photo
    @photo ||= current_photos.first
  end

  def photo_url
    return unless photo&.file

    Rails.application.routes.url_helpers.rails_blob_path(photo.file, only_path: true)
  end

  def calculate_has_photo
    self.has_photo = current_photos.size.positive?
    has_photo
  end

  private

  def maximum_attachments_exceeded
    return unless attachments.size > (MAX_ATTACHMENTS - 1)

    errors.add(:attachments, 'errors.attachments.maximum')
  end
end
