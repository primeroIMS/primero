module AudioHelper
  include AttachmentHelper

  def add_audio_file(audio_file, content_type)
    attachment = FileAttachment.from_file(audio_file, content_type, "audio", key_for_content_type(content_type))
    attach(attachment)
    setup_mime_specific_audio(attachment)
  end

  def recorded_audio=(audio_file_name = "")
    self["recorded_audio"] ||= audio_file_name
  end

  def audio=(audio_file)
    return unless audio_file.respond_to? :content_type
    delete_audio_attachment_file
    @audio_file_name = audio_file.original_filename
    @audio = audio_file
    attachment = FileAttachment.from_uploadable_file(audio_file, "audio")
    self['recorded_audio'] = attachment.name
    attach(attachment)
    setup_original_audio(attachment)
    setup_mime_specific_audio(attachment)
  end

  def audio
    return nil if self.id.nil? || self['audio_attachments'].nil?
    attachment_key = self['audio_attachments']['original']
    return nil unless has_attachment? attachment_key

    data = read_attachment attachment_key
    content_type = self['_attachments'][attachment_key]['content_type']
    FileAttachment.new attachment_key, content_type, data
  end

  def delete_audio
    return if self.id.nil? || self['audio_attachments'].nil?
    delete_audio_attachment_file
    self['audio_attachments'] = nil
    self['recorded_audio'] = nil
  end

  def link_to_download_audio_with_key(key, display_object)
    audio_url = send("#{display_object.class.name.underscore.downcase}_audio_url", display_object.id, key)
    link_to key.humanize, audio_url, :id => key, :target => '_blank'
  end

  def model_name_for_audio_link
    model = self.class.name.underscore.downcase
    if model == "child"
      model = "case"
    end
    model
  end

  private
  def setup_mime_specific_audio(file_attachment)
    audio_attachments = (self['audio_attachments'] ||= {})
    content_type_for_key = file_attachment.mime_type.to_sym.to_s
    audio_attachments[content_type_for_key] = file_attachment.name
  end

  def setup_original_audio(attachment)
    audio_attachments = (self['audio_attachments'] ||= {})
    audio_attachments.clear
    audio_attachments['original'] = attachment.name
  end

  def delete_audio_attachment_file
    return if self.id.nil? || self['audio_attachments'].nil?
    audio_key = self['audio_attachments']['original']
    delete_attachment(audio_key)
  end

  def key_for_content_type(content_type)
    Mime::Type.lookup(content_type).to_sym.to_s
  end

end
