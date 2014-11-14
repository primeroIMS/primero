module AudioHelper
  def link_to_download_audio_with_key(key, display_object)
    audio_url = send("#{display_object.class.name.underscore.downcase}_audio_url", display_object.id, key)
    link_to key.humanize, audio_url, :id => key, :target => '_blank'
  end
end
