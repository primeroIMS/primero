module LogoHelper
  include AttachmentHelper

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

  def display_agency_logos
    @agency_logos.each do |lk|
      img = send("agency_logo_url", lk[:id], lk[:filename])
      concat(content_tag(:li, image_tag(img, height: '29')))
    end
  end
end
