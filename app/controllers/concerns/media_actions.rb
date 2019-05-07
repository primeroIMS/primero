module MediaActions
  extend ActiveSupport::Concern

  included do
    before_action :find_object
    before_action :find_photo_attachment, :only => [:show_photo, :show_resized_photo, :show_thumbnail]
  end

  def index
    render :json => photos_details
  end

  def show_photo
    send_photo_data(@attachment.data.read, :type => @attachment.content_type, :disposition => 'inline')
  end

  def show_resized_photo
    resized = @attachment.resize params[:size]
    send_photo_data(resized.data.read, :type => @attachment.content_type, :disposition => 'inline')
  end

  def show_thumbnail
    resized = @attachment.resize "160x160"
    send_photo_data(resized.data.read, :type => @attachment.content_type, :disposition => 'inline')
  end

  def download_audio
    find_audio_attachment
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    redirect_to(:controller => self.model_class.name.underscore.downcase.pluralize, :action => 'show', :id => object.id) and return unless @attachment
    send_data( @attachment.data.read, :filename => audio_filename(@attachment), :type => @attachment.content_type )
    cookies[:download_status_finished] = true
  end

  def download_document
    find_document_attachment
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    redirect_to(:controller => self.model_class.name.underscore.downcase.pluralize, :action => 'show', :id => object.id) and return unless @attachment
    send_data(@attachment.data.read, :filename => document_filename(@attachment), :type => @attachment.content_type)
    cookies[:download_status_finished] = true
  end

  def document_filename attachment
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    if object['document_keys'].include? attachment.name
      doc_forms = object.keys.select{ |k| k.include? '_documents' }
      doc_forms.each do |form_name|
        file = object[form_name].select{ |f| f.attachment_key == attachment.name }.first
        return file['file_name'] if file.present? && file['file_name'].present?
      end
    end
  end

  def manage_photos
    @photos_details = photos_details
  end

  private

  def find_object
    obj_name = self.model_class.name.underscore.downcase
    id = params["#{obj_name}_id"] || params['id']
    instance_variable_set("@#{obj_name}", self.model_class.find_by(id: id))
  end

  def find_document_attachment
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    begin
      @attachment = object.media_for_key(params[:document_id])
    rescue => e
      p e.inspect
    end
  end

  def find_audio_attachment
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    begin
      @attachment = params[:id] ? object.media_for_key(params[:id]) : object.audio
    rescue => e
      p e.inspect
    end
  end

  def find_photo_attachment
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    redirect_to(:photo_id => object.current_photo_key, :ts => object.last_updated_at) and return if
      params[:photo_id].to_s.empty? and object.current_photo_key.present?

    begin
      @attachment = params[:photo_id] == '_missing_' ? no_photo_attachment : object.media_for_key(params[:photo_id])
    rescue => e
      logger.warn "Error getting photo"
      logger.warn e.inspect
    end

    redirect_to :photo_id => '_missing_' if @attachment.nil?
  end

  def no_photo_attachment
    @@no_photo_clip ||= File.binread(File.join(Rails.root, "app/assets/images/no_photo_clip.jpg"))
    FileAttachment.new "no_photo", "image/jpg", @@no_photo_clip
  end

  def audio_filename attachment
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    "audio_" + object.unique_identifier + AudioMimeTypes.to_file_extension(attachment.mime_type)
  end

  def photos_details
    object = instance_variable_get("@#{self.model_class.name.underscore.downcase}")
    object['photo_keys'].collect do |photo_key|
      {
        :photo_url => photo_url(object, photo_key),
        :thumbnail_url => thumbnail_url(object, photo_key),
        :select_primary_photo_url => select_primary_photo_url(object, photo_key)
      }
    end
  end

  def photo_url(object, photo_key)
    send("#{object.class.name.underscore.downcase}_photo_url", object, photo_key)
  end

  def thumbnail_url(object, photo_key)
    send("#{object.class.name.underscore.downcase}_thumbnail_url", object, photo_key)
  end

  def select_primary_photo_url(object, photo_key)
    send("#{object.class.name.underscore.downcase}_select_primary_photo_url, ", object, photo_key)
  end

  def send_photo_data(*args)
    expires_in 1.year, :public => true if params[:ts]
    send_data *args
  end

end
