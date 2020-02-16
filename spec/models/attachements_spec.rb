# frozen_string_literal: true

require 'rails_helper'

describe Attachment do
  let(:user) { instance_double('User', user_name: 'test_user', full_name: 'Test User') }

  let(:child) do
    child = Child.new_with_user(user, name: 'Test')
    child.save! && child
  end

  let(:attachment_base64) do
    path = Rails.root.join('spec', 'resources', 'jorge.jpg')
    Base64.encode64(File.open(path, 'rb').read)
  end

  let(:attachment) do
    Attachment.new(
      record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
      file_name: 'jorge.jpg', attachment: attachment_base64
    )
  end

  describe '.attach!' do
    before :each do
      @record_updated_on = child.last_updated_at
      attachment.attach!
    end

    it 'attaches a base64 encoded file' do
      expect(attachment.file.attached?).to be_truthy
    end

    xit 'updates the associated record' do
      expect(child.last_updated_at).to be > @record_updated_on
    end
  end

  describe '.detach!' do
    before :each do
      @record_updated_on = child.last_updated_at
      attachment.attach!
      child.reload
      attachment.detach!
    end

    it 'detaches the file and removes the attachment record' do
      expect(attachment.file.attached?).to be_falsey
      expect(attachment.destroyed?).to be_truthy
    end

    xit 'updates the associated record' do
      expect(child.last_updated_at).to be > @record_updated_on
    end
  end

  after(:each) do
    clean_data(Attachment, Child, User)
  end
end