# frozen_string_literal: true

require 'rails_helper'

describe Attachable do
  let(:user) { instance_double('User', user_name: 'test_user', full_name: 'Test User') }
  let(:child) do
    child = Child.new_with_user(user, name: 'Test')
    child.save!
    Attachment.new(
      record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
      file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), date: Date.new(2020, 1, 1)
    ).attach!
    Attachment.new(
      record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
      file_name: 'unicef.png', attachment: attachment_base64('unicef.png'), date: Date.new(2020, 2, 1)
    ).attach!
    child
  end

  describe '.photo' do
    it 'returns the latest photo as a primary photo' do
      expect(child.photo.file_name).to eq('unicef.png')
    end
  end

  describe '.photo_url' do
    it 'returns the active storage url for the attached primary photo' do
      expect(child.photo_url).to include('active_storage')
      expect(child.photo_url).to include('unicef.png')
    end
  end

  describe '.has_photo?' do
    it 'is true if photo attachments exist' do
      expect(child.has_photo?).to be_truthy
    end
  end

  after :each do
    clean_data(Attachment, Child)
  end
end