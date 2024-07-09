# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Attachment, search: true do
  let(:user) { fake_user(user_name: 'test_user') }

  let(:child) do
    child = Child.new_with_user(user, name: 'Test')
    child.save! && child
  end

  let(:attachment) do
    Attachment.new(
      record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
      file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
    )
  end

  describe '.attach!' do
    before :each do
      @record_updated_on = child.last_updated_at
      child.reload
      attachment.attach!
    end

    it 'attaches a base64 encoded file' do
      expect(attachment.file.attached?).to be_truthy
    end

    it 'has_photo is true for the record' do
      expect(
        PhoneticSearchService.search(
          Child, { filters: [SearchFilters::Value.new(field_name: 'has_photo', value: true)] }
        ).total
      ).to eq(1)
    end

    xit 'updates the associated record' do
      expect(child.last_updated_at).to be > @record_updated_on
    end

    xit 'logs a record history object when an attachment is made' do
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

    it 'has_photo is false for the record' do
      expect(
        PhoneticSearchService.search(
          Child, { filters: [SearchFilters::Value.new(field_name: 'has_photo', value: true)] }
        ).total
      ).to eq(0)
    end

    xit 'updates the associated record' do
      expect(child.last_updated_at).to be > @record_updated_on
    end

    xit 'logs a record history object when a detachment is made' do
    end
  end

  describe 'validations' do
    it 'cannot attach files greater than 4 mb' do
      attachment = Attachment.new(
        record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'huge.jpg', attachment: attachment_base64('huge.jpg')
      )
      attachment.attach
      expect(attachment.valid?).to be_falsey
      expect(attachment.errors[:file][0]).to include('size')
    end

    it 'cannot attach audio files of an improper mimetype' do
      attachment = Attachment.new(
        record: child, field_name: 'recorded_audio', attachment_type: Attachment::AUDIO,
        file_name: 'sample.ogg', attachment: attachment_base64('sample.ogg')
      )
      attachment.attach
      expect(attachment.valid?).to be_falsey
      expect(attachment.errors[:file][0]).to include('audio/mpeg')
    end

    it 'cannot attach document files of an improper mimetype' do
      attachment = Attachment.new(
        record: child, field_name: 'other_documents', attachment_type: Attachment::DOCUMENT,
        file_name: 'exe_file.exe', attachment: attachment_base64('exe_file.exe')
      )
      attachment.attach
      expect(attachment.valid?).to be_falsey
      expect(attachment.errors[:file][0]).to include('application/pdf')
    end

    it 'cannot attach image files of an improper mimetype' do
      attachment = Attachment.new(
        record: child, field_name: 'other_documents', attachment_type: Attachment::IMAGE,
        file_name: 'sample.bmp', attachment: attachment_base64('sample.bmp')
      )
      attachment.attach
      expect(attachment.valid?).to be_falsey
      expect(attachment.errors[:file][0]).to include('image/jpg')
    end

    context 'with 100 attachments' do
      before :each do
        100.times.each do |i|
          Attachment.new(
            record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
            file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), comments: i.to_s
          ).attach!
        end
        child.reload
      end

      it 'disallows attaching more than 100 documents to a single record' do
        attachment = Attachment.new(
          record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
          file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), comments: 'not this one!'
        )
        expect { attachment.attach! }.to raise_error(ActiveRecord::RecordInvalid)
        expect(attachment.errors.full_messages).to eq ['errors.attachments.maximum']
        expect(attachment.persisted?).to be_falsey
      end
    end

    context 'when maximum_attachments_per_record is set in SystemSettings' do
      before :each do
        clean_data(SystemSettings)
        SystemSettings.create!(
          system_options: {
            maximum_attachments_per_record: 2
          }
        )
        SystemSettings.stub(:current).and_return(SystemSettings.first)
        SystemSettings.current.maximum_attachments_per_record.times.each do |i|
          Attachment.new(
            record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
            file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), comments: i.to_s
          ).attach!
        end
        child.reload
      end

      it 'disallows attaching more than 3 documents to a single record' do
        attachment = Attachment.new(
          record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
          file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), comments: 'not this one!'
        )
        expect(child.attachments.count).to eq SystemSettings.current.maximum_attachments_per_record
        expect { attachment.attach! }.to raise_error(ActiveRecord::RecordInvalid)
        expect(attachment.errors.full_messages).to eq ['errors.attachments.maximum']
        expect(attachment.persisted?).to be_falsey
      end

      after :each do
        clean_data(SystemSettings)
      end
    end
  end

  after(:each) do
    clean_data(Child, Attachment, User)
  end
end
