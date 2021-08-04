# frozen_string_literal: true

# Rspec helpers for file attachment
module FilesTestHelper
  extend self # TODO: Delete after agency
  extend ActionDispatch::TestProcess

  def attachment_base64(file_name)
    path = spec_resource_path(file_name)
    Base64.encode64(File.open(path, 'rb').read)
  end

  def attachment_strict_base64(file_name)
    path = spec_resource_path(file_name)
    Base64.strict_encode64(File.open(path, 'rb').read)
  end

  def attachment_as_io(file_name)
    data_base64 = attachment_base64(file_name)
    decoded_data = Base64.decode64(data_base64).force_encoding('UTF-8')
    StringIO.new(decoded_data)
  end

  def spec_resource_path(file_name)
    Rails.root.join('spec', 'resources', file_name)
  end

  def spec_resource_io(file_name)
    File.open(spec_resource_path(file_name), 'rb')
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

  def logo_base64
    attachment_base64(Rails.root.join('spec', 'resources', 'unicef.png'))
  end

  def logo_old_base64
    attachment_base64(Rails.root.join('spec', 'resources', 'unicef-old.png'))
  end

  def pdf_file
    fixture_file_upload(Rails.root.join('spec', 'resources', 'dummy.pdf'))
  end
end
