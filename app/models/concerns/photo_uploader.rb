module PhotoUploader
  extend ActiveSupport::Concern
  include Attachable
  include PhotoHelper

  MAX_PHOTOS = 10

  included do
    before_save :update_photo_keys

    property :photo_keys, [String]
    property :current_photo_key, String

    validate :validate_photos_size
    validate :validate_photos_count
    validate :validate_photos

    def has_photo
      self.current_photo_key.present? || self.photo_keys.present?
    end
  end

  def compact
    self.current_photo_key = '' if self.current_photo_key.nil?
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
    return true if @photos.blank? || (@photos.size + self.photo_keys.size) <= MAX_PHOTOS
    i18n_message = I18n.t("errors.models.photo.photo_count", :photos_count => MAX_PHOTOS, :model_name => model_name_for_messages)
    errors.add(:photo, i18n_message)
    error_with_section(:current_photo_key, i18n_message)
  end

  def rotate_photo(angle)
    existing_photo = primary_photo
    image = MiniMagick::Image.read(existing_photo.data.read)
    image.rotate(angle)

    attachment = FileAttachment.new(existing_photo.name, existing_photo.content_type, image.to_blob, self)

    photo_key_index = self.photo_keys.find_index(existing_photo.name)
    self.photo_keys.delete_at(photo_key_index)
    self['_attachments'].keys.each do |key|
      delete_attachment(key) if key == existing_photo.name || key.starts_with?(existing_photo.name)
    end

    self.photo_keys.insert(photo_key_index, existing_photo.name)
    attach(attachment)
  end

  def delete_photos(photo_names)
    return unless photo_names
    photo_names = photo_names.keys if photo_names.is_a? Hash
    photo_names.map { |x| related_keys(x) }.flatten.each do |key|
      photo_key_index = self.photo_keys.find_index(key)
      self.photo_keys.delete_at(photo_key_index) unless photo_key_index.nil?
      delete_attachment(key)
    end

    @deleted_photo_keys ||= []
    @deleted_photo_keys.concat(photo_names)
  end

  def photo=(new_photos)
    return unless new_photos
    #basically to support any client passing a single photo param, only used by child_spec AFAIK
    photos = case new_photos
    when Hash
      new_photos.to_a.sort.map { |k, v| v }
    when Array
      new_photos
    else
      [new_photos]
    end
    self.photos = photos
  end

  def photos=(new_photos)
    @photos = []
    @new_photo_keys = new_photos.select { |photo| photo.respond_to? :content_type }.collect do |photo|
      @photos << photo
      attachment = FileAttachment.from_uploadable_file(photo, "photo-#{photo.path.hash}")
      attach(attachment)
      self.current_photo_key = attachment.name if photo.original_filename.include?(self.current_photo_key.to_s)
      attachment.name
    end
  end

  def update_photo_keys
    return if @new_photo_keys.blank? && @deleted_photo_keys.blank?
    self.photo_keys.concat(@new_photo_keys).uniq! if @new_photo_keys
    @deleted_photo_keys.each { |p|
      self.photo_keys.delete p
      self.current_photo_key = self.photo_keys.first if p == self.current_photo_key
    } if @deleted_photo_keys

    self.current_photo_key ||= self.photo_keys.first unless self.photo_keys.include?(self.current_photo_key)

    self.current_photo_key ||= @new_photo_keys.first if @new_photo_keys

    @new_photo_keys, @deleted_photo_keys = nil, nil
  end

  def photos
    return [] if self.photo_keys.blank?
    self.photo_keys.sort_by do |key|
      key == self.current_photo_key ? "" : key
    end.collect do |key|
      attachment(key)
    end
  end

  def photos_index
    return [] if self.photo_keys.blank?
    self.photo_keys.collect do |key|
      {
          :photo_uri => send("#{self.class.name.underscore.downcase}_photo_url", self, key),
          :thumbnail_uri => send("#{self.class.name.underscore.downcase}_photo_url", self, key)
      }
    end
  end

  def primary_photo
    key = self.current_photo_key
    (key == "" || key.nil?) ? nil : attachment(key)
  end

  def primary_photo_id
    primary_photo_id = self.current_photo_key.present? ? self.current_photo_key : self.photo_keys.try(:first)
  end

  def primary_photo_id=(photo_key)
    unless self.photo_keys.include?(photo_key)
      raise I18n.t("errors.models.photo.primary_photo_id", :photo_id => photo_key)
    end
    self.current_photo_key = photo_key
  end
end
