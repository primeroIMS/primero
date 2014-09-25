module PhotoUploader
  extend ActiveSupport::Concern

  MAX_PHOTOS = 10

  include PhotoHelper

  included do
    before_save :update_photo_keys

    validate :validate_photos_size
    validate :validate_photos_count
    validate :validate_photos
    
    def has_photo
      self["current_photo_key"].present?
    end
  end

  def compact
    self['current_photo_key'] = '' if self['current_photo_key'].nil?
    self
  end

  def validate_photos
    return true if @photos.blank? || @photos.all? { |photo| /image\/(jpg|jpeg|png)/ =~ photo.content_type }
    i18n_message = I18n.t("errors.models.photo.photo_format", :model_name => model_name_for_messages)
    errors.add(:photo, i18n_message)
    error_with_section(:current_photo_key, i18n_message)
  end

  def validate_photos_size
    return true if @photos.blank? || @photos.all? { |photo| photo.size < 10.megabytes }
    i18n_message = I18n.t("errors.models.photo.photo_size")
    errors.add(:photo, i18n_message)
    error_with_section(:current_photo_key, i18n_message)
  end

  def validate_photos_count
    return true if @photos.blank? || (@photos.size + self['photo_keys'].size) <= MAX_PHOTOS
    i18n_message = I18n.t("errors.models.photo.photo_count", :photos_count => MAX_PHOTOS, :model_name => model_name_for_messages)
    errors.add(:photo, i18n_message)
    error_with_section(:current_photo_key, i18n_message)
  end

end
