module LogoUploader
  extend ActiveSupport::Concern
  include Attachable
  include LogoHelper

  MAX_LOGOS = 2

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

  def upload_logo=(logo)
    delete_logo_attachment_file
    @logo = logo['logo']
    @logo_file_name = @logo.original_filename
    attachment = FileAttachment.from_uploadable_file(@logo, "logo")
    self['logo_key'] = attachment.name
    attach(attachment)
  end

  def delete_logo_attachment_file
    return if self.id.nil? || self['_attachments'].nil?
    self['_attachments'].keys.each do |k|
      delete_attachment(k)
    end
  end
end
