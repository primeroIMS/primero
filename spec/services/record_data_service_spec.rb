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
    let(:data) { RecordDataService.new.select_fields(@record.data, %w[name field2]) }

    it 'does not discard nil value fields' do
      expect(data.key?('field2')).to be_truthy
    end

    it 'selects only the requested fields' do
      expect(data.keys).to match_array(%w[field2 name])
    end
  end

  describe 'embed_user_scope' do
    it 'returns true if the user is the record owner and is scoped to associated records' do
      data = RecordDataService.new.embed_user_scope({}, @record, %w[record_in_scope], @user)
      expect(data['record_in_scope']).to be_truthy
    end

    it 'returns false if the user is not the record owner and is scored to associated records' do
      user2 = User.new(user_name: 'user2', role: @role)
      data =  RecordDataService.new.embed_user_scope({}, @record, %w[record_in_scope], user2)
      expect(data['record_in_scope']).to be_falsey
    end
  end

  describe 'embed_hidden_name' do
    it 'masks the hidden name if specified as such on the record' do
      data =  RecordDataService.new.embed_hidden_name({}, @record, %w[name])
      expect(data['name']).to match(/\*+/)
    end
  end

  describe 'embed_flag_metadata' do
    it 'injects the flag count' do
      data = RecordDataService.new.embed_flag_metadata({}, @record, %w[flag_count])
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
      data = RecordDataService.new.embed_photo_metadata({}, @record, %w[photos])
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
      @record.reload
      binary = double('binary')
      allow(binary).to receive(:pluck).and_return(%w[photos other_photos])
      allow(Field).to receive(:binary).and_return(binary)
    end

    it 'it orders attachments by date, nils last' do
      data = RecordDataService.new.embed_attachments({}, @record, %w[photos])
      expect(data['photos'][0]['file_name']).to eq('unicef.png')
      expect(data['photos'][1]['file_name']).to eq('jorge.jpg')
      expect(data['photos'][2]['file_name']).to eq('jeff.png')
    end

    it 'excludes attachments for fields that are not requested' do
      data = RecordDataService.new.embed_attachments({}, @record, %w[other_photos])
      expect(data['photos'].present?).to be_falsey
      expect(data['other_photos'].size).to eq(1)
      expect(data['other_photos'][0]['file_name']).to eq('jeff.png')
    end

    after :each do
      clean_data(Attachment, Child)
    end
  end

  describe '.embed_associations_as_data' do
    it 'return the incident_details for child' do
      @record.incidents = [Incident.create!(data: { incident_date: Date.new(2019, 3, 1),
                                                    description: 'Test 1',
                                                    owned_by: @user.user_name })]
      data = RecordDataService.new.embed_associations_as_data({}, @record, %w[incident_details], @user)

      expect(data.key?('incident_details')).to be_truthy
    end
  end

  describe '.embed_computed_fields' do
    let(:synced_at) { DateTime.new(2021, 1, 31, 1, 2, 3) }

    it 'embeds all non-nil permitted computed fields on the record that are not part of the data hash' do
      allow(@record).to receive(:synced_at).and_return(synced_at)
      allow(@record).to receive(:sync_status).and_return(AuditLog::SYNCED)
      allow(@record).to receive(:day_of_birth).and_return(60)

      data = RecordDataService.new.embed_computed_fields({ 'field1' => 'value1' }, @record, %w[synced_at field1])
      expect(data.keys).to match_array(%w[synced_at field1])
      expect(data['synced_at']).to eq(synced_at)
    end
  end

  after :each do
    clean_data(Role)
  end
end
