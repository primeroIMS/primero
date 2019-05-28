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

  def invalid_photo
    {'photos' => upload('textfile.txt', 'text/plain')}
  end

  def max_documents_as_a_paramenter
    {'other_documents' => upload_max_documents }
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

  def upload_max_documents
    file_path = Rails.root.join('spec', 'resources', 'textfile.txt')
    type = 'text/plain'
    Array.new(101, {'document' => fixture_file_upload(file_path, type)})
  end
end
