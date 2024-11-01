# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
    @incident = Incident.new_with_user(@user, incident_date: Date.today, violation_category: %w[foo bar])
    @incident.save!
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

  describe '.embed_incident_data' do
    it 'masks the hidden name if specified as such on the record' do
      data =  RecordDataService.new.embed_incident_data({}, @incident, %w[incident_date_derived violation_category])
      expect(data['incident_date_derived']).to eq(Date.today)
      expect(data['violation_category']).to match_array(%w[foo bar])
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

    it 'injects the paths to the photo for the photos field' do
      data = RecordDataService.new.embed_photo_metadata({}, @record, %w[photos])
      expect(data['photo']).to match(/.+jorge\.jpg$/)
    end

    it 'injects the paths to the photo for the photo field' do
      data = RecordDataService.new.embed_photo_metadata({}, @record, %w[photo])
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

    it 'returns only the selected_field_names' do
      incident = Incident.create!(data: { incident_date: Date.new(2019, 3, 1),
                                          description: 'Test 1',
                                          owned_by: @user.user_name })
      victim = IndividualVictim.create!(data: { name: 'victim name' })
      source = Source.create!(data: { name: 'source name' })
      Violation.create!(
        data: { name: 'violation_name', type: 'recruitment' },
        sources: [source], individual_victims: [victim], incident:
      )
      incident.reload

      data = RecordDataService.new.embed_associations_as_data({}, incident, %w[sources], @user)

      expect(data.key?('sources')).to be_truthy
      expect(data.key?('individual_victims')).to be_falsey
    end

    after :each do
      clean_data(IndividualVictim, Violation, Source, Incident)
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

  describe 'family_members' do
    let(:user2) do
      user = User.new(user_name: 'user_mgr_cp', full_name: 'Test User Mgr CP', role: @role)

      user.save(validate: false) && user
    end

    let(:family) do
      family = Family.new_with_user(
        @user,
        {

          family_number: 'fc3f17e',

          family_members: [

            { 'unique_id' => '48ca2f90', 'relation_sex' => 'male',
              'case_id' => '9de12cce-16f9-498c-83e9-4b1317d70e42' },

            { 'unique_id' => '0671b1cd', 'relation_sex' => 'female',

              'case_id' => '530e67c2-81fa-41ee-aa7b-b98b552954ca' },

            { 'unique_id' => 'b57374ec', 'relation_sex' => 'male',
              'case_id' => '98e25d95-1365-4ae9-afd0-53f18e86a101' }

          ]

        }
      )
      family.save!
      family
    end

    let(:child1) do
      child = Child.new_with_user(@user, { age: 6, sex: 'male' })
      child.id = '530e67c2-81fa-41ee-aa7b-b98b552954ca'
      child.family = family
      child.family_member_id = 'f5775818'
      child.family_details_section = [
        { 'unique_id' => '48ca2f90', 'relation' => 'brother' },
        { 'unique_id' => 'b57374ec', 'relation' => 'brother' }
      ]
      child.save!
      child
    end

    let(:child2) do
      child = Child.new_with_user(user2, { age: 7, sex: 'male' })
      child.id = '9de12cce-16f9-498c-83e9-4b1317d70e42'
      child.family = family
      child.family_member_id = 'f5775818'
      child.family_details_section = [
        { 'unique_id' => '0671b1cd', 'relation' => 'sister' },
        { 'unique_id' => 'b57374ec', 'relation' => 'brother' }
      ]
      child.save!
      child
    end

    let(:child3) do
      child = Child.new_with_user(@user, { age: 8, sex: 'male' })
      child.id = '98e25d95-1365-4ae9-afd0-53f18e86a101'
      child.family = family
      child.family_member_id = 'f5775818'
      child.family_details_section = [
        { 'unique_id' => '48ca2f90', 'relation' => 'brother' },
        { 'unique_id' => '0671b1cd', 'relation' => 'sister' }
      ]
      child.save!
      child
    end

    describe '.embed_family_details_section' do
      before do
        child2
        child3
        user2
      end

      it 'returns fields included can_read_record for family family_details_section' do
        data = RecordDataService.new.embed_family_details_section({}, child1, %w[family_details_section], @user)

        expect(data['family_details_section']).to match_array(
          [
            { 'can_read_record' => false, 'case_id' => '9de12cce-16f9-498c-83e9-4b1317d70e42', 'relation' => 'brother',
              'relation_sex' => 'male', 'unique_id' => '48ca2f90' },
            { 'can_read_record' => true, 'case_id' => '530e67c2-81fa-41ee-aa7b-b98b552954ca',
              'relation_sex' => 'female', 'unique_id' => '0671b1cd' },
            { 'can_read_record' => true, 'case_id' => '98e25d95-1365-4ae9-afd0-53f18e86a101', 'relation' => 'brother',
              'relation_sex' => 'male', 'unique_id' => 'b57374ec' }
          ]
        )
      end
    end

    describe '.embed_family_members_user_access' do
      before do
        child1
        child2
        child3
        user2
      end

      it 'returns fields included can_read_record for family family_details_section' do
        data = RecordDataService.new.embed_family_members_user_access(
          { 'family_members' => family.family_members }, family, %w[family_members], @user
        )

        expect(data['family_members']).to match_array(
          [
            { 'can_read_record' => false, 'case_id' => '9de12cce-16f9-498c-83e9-4b1317d70e42',
              'relation_sex' => 'male', 'unique_id' => '48ca2f90' },
            { 'can_read_record' => true, 'case_id' => '530e67c2-81fa-41ee-aa7b-b98b552954ca',
              'relation_sex' => 'female', 'unique_id' => '0671b1cd' },
            { 'can_read_record' => true, 'case_id' => '98e25d95-1365-4ae9-afd0-53f18e86a101',
              'relation_sex' => 'male', 'unique_id' => 'b57374ec' }
          ]
        )
      end
    end
  end

  after :each do
    clean_data(User, Role, Child, Family)
  end
end
