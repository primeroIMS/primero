module FilesTestHelper
  extend self
  extend ActionDispatch::TestProcess

  def png_name; 'jeff.png' end
  def png; upload(png_name, 'image/png') end

  def jpg_name; 'jorge.jpg' end
  def jpg; upload(jpg_name, 'image/jpg') end

  def png_as_a_parameter
    {'photos' => upload(png_name, 'image/png')}
  end

  def jpg_as_a_parameter_to_update(id)
    {'photos' => upload_update(id, jpg_name, 'image/jpg')}
  end

  def large_photo_name; 'huge.jpg' end
  def large_photo_as_a_parameter
    {'photos' => upload(large_photo_name, 'image/jpg')}
  end

  def uploadable_large_photo
    large_photo = "spec/resources/huge.jpg"
    File.binwrite large_photo, "hello", 50000 * 1024 unless File.exist? large_photo
    uploadable_photo large_photo
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

  private

  def upload(name, type)
    file_path = Rails.root.join('spec', 'resources', name)
    [{'image' => fixture_file_upload(file_path, type)}]
  end

  def upload_update(id, name, type)
    file_path = Rails.root.join('spec', 'resources', name)
    [{'id' => id, 'image' => fixture_file_upload(file_path, type)}]
  end
end
