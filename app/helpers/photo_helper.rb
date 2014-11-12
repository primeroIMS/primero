module PhotoHelper
  def thumbnail_tag(display_object, key = nil)
    thumbnail_path = send("#{display_object.class.name.underscore.downcase}_thumbnail_path", display_object, key || display_object.current_photo_key, :ts => display_object.last_updated_at)
    image_tag(thumbnail_path, :alt=> display_object['name'])
  end

  def link_to_photo_with_key(key, display_object)
    photo_path = send("#{display_object.class.name.underscore.downcase}_photo_path", display_object, key, :ts => display_object.last_updated_at)
    link_to thumbnail_tag(display_object, key),
      photo_path,
      :id => key,
      :target => '_blank'
  end
end
