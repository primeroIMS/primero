# frozen_string_literal: true

# Rspec helpers for file attachment
module FilesTestHelper
  extend self # TODO: Delete after agency
  extend ActionDispatch::TestProcess

  def attachment_base64(file_name)
    path = spec_resource_path(file_name)
    Base64.encode64(File.open(path, 'rb').read)
  end

  def spec_resource_path(file_name)
    Rails.root.join('spec', 'resources', file_name)
  end

  # TODO: Clean methods below up with agency spec

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
end
