module AudioUploader
  extend ActiveSupport::Concern

  include AudioHelper

  included do
    validate :validate_audio_size
    validate :validate_audio_file_name
  end

  def validate_audio_size
    return true if @audio.blank? || @audio.size < 10.megabytes
    i18n_message = I18n.t("errors.models.audio.audio_size")
    errors.add(:audio, i18n_message)
    error_with_section(:recorded_audio, i18n_message)
  end

  def validate_audio_file_name
    return true if @audio_file_name == nil || /([^\s]+(\.(?i)(amr|mp3))$)/ =~ @audio_file_name
    i18n_message = I18n.t("errors.models.audio.audio_format", :model_name => model_name_for_messages)
    errors.add(:audio, i18n_message)
    error_with_section(:recorded_audio, i18n_message)
  end

  def has_valid_audio?
    validate_audio_size.is_a?(TrueClass) && validate_audio_file_name.is_a?(TrueClass)
  end

end
