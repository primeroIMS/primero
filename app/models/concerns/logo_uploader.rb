module LogoUploader
  extend ActiveSupport::Concern

  MAX_LOGOS = 2

  include LogoHelper

  included do
    property :photo_key, String
    validate :validate_logo_size
    validate :validate_logo
  end

  def validate_logo
    return true if @logo.blank? || /image\/(jpg|jpeg|png|gif)/ =~ @logo.content_type
    i18n_message = I18n.t("errors.agencies.logo_format")
    errors.add(:logo, i18n_message)
  end

  def validate_logo_size
    return true if @logo.blank? || @logo.size < 10.megabytes
    i18n_message = I18n.t("errors.agencies.logo_size")
    errors.add(:logo, i18n_message)
  end
end
