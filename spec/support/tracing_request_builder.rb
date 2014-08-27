module TracingRequestBuilder

  def given_a_tracing_request
    @tracing_request = double(:tracing_request)
    self
  end

  def with_id(tracing_request_id)
    TracingRequest.stub(:get).with(tracing_request_id).and_return @tracing_request
    TracingRequest.stub(:all).and_return [@tracing_request]
    @tracing_request.stub(:id).and_return tracing_request_id
    @tracing_request.stub(:last_updated_at).and_return(Date.today)
    self
  end

  def with_unique_identifier(identifier)
    @tracing_request.stub(:unique_identifier).and_return identifier
    self
  end

  def with_photo(image, image_id = "img", current = true)
    photo = FileAttachment.new image_id, image.content_type, image.data

    @tracing_request.stub(:media_for_key).with(image_id).and_return photo
    @tracing_request.stub(:current_photo_key).and_return(image_id) if current
    @tracing_request.stub(:primary_photo).and_return photo if current
    self
  end

  def with_audio(audio, audio_id ="audio", current = true)
    audio = double(FileAttachment, {:content_type => audio.content_type, :mime_type => audio.mime_type, :data => StringIO.new(audio.data) })
    @tracing_request.stub(:media_for_key).with(audio_id).and_return audio
    @tracing_request.stub(:audio).and_return audio if current
  end

  def with_no_photos
    @tracing_request.stub(:current_photo_key).and_return nil
    @tracing_request.stub(:media_for_key).and_return nil
    @tracing_request.stub(:primary_photo).and_return nil
    self
  end

  def with_rev(revision)
    @tracing_request.stub(:rev).and_return revision
    self
  end

  def with(hash)
    hash.each do |(key, value)|
      @tracing_request.stub(key).and_return(value)
    end
    self
  end

end
