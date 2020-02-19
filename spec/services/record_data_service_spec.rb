# frozen_string_literal: true

require 'rails_helper'

describe RecordDataService do
  before :each do
    permission = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
    )
    @role = Role.new(permissions: [permission])
    @role.save(validate: false)
    @user = User.new(user_name: 'user1', role: @role)
    @record = Child.new_with_user(@user, name: 'Test', hidden_name: true, field1: 'value1', field2: nil)
    allow(@record).to receive(:flag_count).and_return(2)
  end

  describe 'select_fields' do
    let(:data) { RecordDataService.select_fields(@record.data, %w[name field2]) }

    it 'discards nil value fields' do
      expect(data.key?('field2')).to be_falsey
    end

    it 'selects only the requested fields' do
      expect(data.keys).to match_array(%w[name])
    end
  end

  describe 'embed_user_scope' do
    it 'returns true if the user is the record owner and is scoped to associated records' do
      data = RecordDataService.embed_user_scope({}, @record, %w[record_in_scope], @user)
      expect(data['record_in_scope']).to be_truthy
    end

    it 'returns false if the user is not the record owner and is scored to associated records' do
      user2 = User.new(user_name: 'user2', role: @role)
      data =  RecordDataService.embed_user_scope({}, @record, %w[record_in_scope], user2)
      expect(data['record_in_scope']).to be_falsey
    end
  end

  describe 'embed_hidden_name' do
    it 'masks the hidden name if specified as such on the record' do
      data =  RecordDataService.embed_hidden_name({}, @record, %w[name])
      expect(data['name']).to match(/\*+/)
    end
  end

  describe 'embed_flag_metadata' do
    it 'injects the flag count' do
      data = RecordDataService.embed_flag_metadata({}, @record, %w[flag_count])
      expect(data['flag_count']).to eq(2)
    end
  end

  describe 'embed_photo_metadata' do
    before :each do
      @record.save!
      Attachment.new(
        record: @record, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
      ).attach!
    end

    it 'injects the paths to the photo' do
      data = RecordDataService.embed_photo_metadata({}, @record, %w[photos])
      expect(data['photo']).to match(/.+jorge\.jpg$/)
    end

    after :each do
      clean_data(Attachment, Child)
    end
  end

  describe 'embed_attachments' do
    before :each do
      @record.save!
      a = Attachment.new(
        record: @record, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'),
        date: Date.new(2020, 1, 1)
      )
      a.attach!
      Attachment.new(
        record: @record, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'unicef.png', attachment: attachment_base64('unicef.png'),
        date: Date.new(2020, 2, 1)
      ).attach!
      Attachment.new(
        record: @record, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jeff.png', attachment: attachment_base64('jeff.png')
      ).attach!
      Attachment.new(
        record: @record, field_name: 'other_photos', attachment_type: Attachment::IMAGE,
        file_name: 'jeff.png', attachment: attachment_base64('jeff.png')
      ).attach!
      allow(Field).to receive(:binary_field_names).and_return(%w[photos other_photos])
    end

    it 'it orders attachments by date, nils last' do
      data = RecordDataService.embed_attachments({}, @record, %w[photos])
      expect(data['photos'][0]['file_name']).to eq('unicef.png')
      expect(data['photos'][1]['file_name']).to eq('jorge.jpg')
      expect(data['photos'][2]['file_name']).to eq('jeff.png')
    end

    it 'excludes attachments for fields that are not requested' do
      data = RecordDataService.embed_attachments({}, @record, %w[other_photos])
      expect(data['photos'].present?).to be_falsey
      expect(data['other_photos'].size).to eq(1)
      expect(data['other_photos'][0]['file_name']).to eq('jeff.png')
    end

    after :each do
      clean_data(Attachment, Child)
    end

  end

  after :each do
    clean_data(Role)
  end
end