module FilesTestHelper
  extend self
  extend ActionDispatch::TestProcess

  IMAGE_TYPES = { jpg:'image/jpg', png: 'image/png', gif: 'image/gif', bmp: 'image/x-ms-bmp'}
  IMAGE_SAMPLES = { jpg:'jorge.jpg', png: 'jeff.png', gif: 'test.gif', bmp: 'sample.bmp', }
  AUDIO_TYPES = { mp3: 'audio/mpeg', amr: 'audio/amr', ogg: 'audio/ogg', wav: 'audio/x-wav', png: 'image/png' }

  def png_name; 'jeff.png' end
  def png; upload(png_name, 'image/png') end

  def jpg_name; 'jorge.jpg' end
  def jpg; upload(jpg_name, 'image/jpg') end

  def png_as_a_parameter
    {'photos' => upload(png_name, 'image/png')}
  end

  def jpg_as_a_parameter_to_update(id)
    {'photos' => upload_update(id, jpg_name, 'image/jpg', 'image')}
  end

  def large_photo_as_a_parameter
    {'photos' => upload('huge.jpg', 'image/jpg')}
  end

  def large_audio_as_a_parameter
    { "recorded_audio" => upload_audio('huge', 'mp3')}
  end

  def invalid_photo
    {'photos' => upload('textfile.txt', 'text/plain')}
  end

  def max_documents_as_a_paramenter
    {'other_documents' => upload_max_documents }
  end

  def uploadable_audio_mp3
    file_path = Rails.root.join('spec', 'resources', 'sample.mp3')
    fixture_file_upload(file_path, 'audio/mpeg')
  end

  def logo
    file_path = Rails.root.join('spec', 'resources', 'unicef.png')
    fixture_file_upload(file_path, 'image/png')
  end

  def logo_old
    file_path = Rails.root.join('spec', 'resources', 'unicef-old.png')
    fixture_file_upload(file_path, 'image/png')
  end

  def image_without_extension
    { 'photos' => upload('unicef_without_extension', 'image/png') }
  end

  def image(type)
    { 'photos' => upload_image(IMAGE_SAMPLES[type.to_sym], type) }
  end

  def multiple_image(number_photos)
    images = []
    number_photos.times do
      images << upload('jorge.jpg', IMAGE_TYPES[:jpg])
    end
    { 'photos' => [images].flatten }
  end

  def audio(type)
    { 'recorded_audio' => upload_audio('sample', type) }
  end

  def audio_to_update(id)
    {'recorded_audio' => upload_update(id, 'sample.amr', 'image/jpg', 'audio')}
  end

  private

  def upload(name, type)
    file_path = Rails.root.join('spec', 'resources', name)
    [{'image' => fixture_file_upload(file_path, type)}]
  end

  def upload_update(id, name, type, attach_type)
    file_path = Rails.root.join('spec', 'resources', name)
    [{'id' => id, attach_type => fixture_file_upload(file_path, type)}]
  end

  def upload_max_documents
    file_path = Rails.root.join('spec', 'resources', 'textfile.txt')
    type = 'text/plain'
    Array.new(101, {'document' => fixture_file_upload(file_path, type)})
  end

  def upload_image(name, type)
    file_path = Rails.root.join('spec', 'resources', name)
    [{ 'image' => fixture_file_upload(file_path, IMAGE_TYPES[type.to_sym]) }]
  end

  def upload_audio(name, type)
    file_path = Rails.root.join('spec', 'resources', "#{name}.#{type}")
    [{ 'audio' => fixture_file_upload(file_path, AUDIO_TYPES[type.to_sym]) }]
  end
end
