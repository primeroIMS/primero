# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe DataRemovalService do
  describe 'removed_records' do
    let(:child1) do
      child1 = Child.create!(age: 12, sex: 'male')
      child1.created_at = DateTime.new(2015, 7, 10, 3, 5, 6)
      child1.save!

      Attachment.new(
        record: child1, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), date: Date.new(2020, 1, 1)
      ).attach!

      child1
    end

    let(:child2) do
      child2 = Child.create!(age: 7, sex: 'female')
      child2.created_at = DateTime.new(2011, 10, 7, 4, 5, 6)
      child2.save!
      child2
    end

    let(:incident1) do
      incident1 = Incident.create!(incident_code: '0001', description: 'First incident')
      incident1.created_at = DateTime.new(2011, 10, 7, 4, 5, 6)
      incident1.add_flag('This is test flag 2', Date.today, 'fakeuser')
      incident1.save!
      incident1
    end

    let(:incident2) do
      incident2 = Incident.create!(incident_code: '0002', description: 'Second incident', incident_case_id: child1.id)
      incident2.created_at = DateTime.new(2015, 7, 10, 3, 5, 6)
      incident2.save!
      incident2
    end

    let(:tracing1) do
      tracing1 = TracingRequest.create!(relation_name: 'William Jones')
      tracing1.created_at = DateTime.new(2011, 10, 7, 4, 5, 6)
      tracing1.save!
      tracing1
    end

    before do
      clean_data(Attachment, Incident, TracingRequest, Child)
      ActiveRecord::Base.connection.execute('DELETE FROM active_storage_attachments')
      ActiveRecord::Base.connection.execute('DELETE FROM active_storage_blobs')
      child1
      child2
      incident1
      incident2
      tracing1
    end

    it 'removes all records' do
      DataRemovalService.remove_records

      expect(Child.all).to be_empty
      expect(Incident.all).to be_empty
      expect(TracingRequest.all).to be_empty
      expect(RecordHistory.all).to be_empty
      expect(Flag.all).to be_empty
      expect(Alert.all).to be_empty
      expect(Transition.all).to be_empty
      expect(Attachment.all).to be_empty
      expect(SearchableIdentifier.all).to be_empty
      expect(
        ActiveRecord::Base.connection.exec_query('SELECT id FROM active_storage_attachments').to_a
      ).to be_empty
      expect(
        ActiveRecord::Base.connection.exec_query('SELECT id FROM active_storage_blobs').to_a
      ).to be_empty
    end

    it 'removes records that meet the filters' do
      DataRemovalService.remove_records(filters: { created_at: { from: '2011-10-01', to: '2011-10-30' } })

      expect(Child.all.size).to eq(1)
      expect(Incident.all.size).to eq(1)
      expect(
        RecordHistory.where(record_id: child2.id).or(
          RecordHistory.where(record_id: incident1.id)
        ).or(RecordHistory.where(record_id: tracing1.id))
      ).to be_empty
      expect(TracingRequest.all).to be_empty
      expect(Flag.all).to be_empty
      expect(Alert.all).to be_empty
      expect(Transition.all).to be_empty
      expect(Attachment.all.size).to eq(1)
      expect(SearchableIdentifier.all.size).to eq(7)
    end

    it 'removes records Incidents that meet the filters without deleting the associated cases' do
      DataRemovalService.remove_records(
        record_models: ['Incident'],
        filters: { created_at: { from: '2015-07-01', to: '2015-07-31' } }
      )

      expect(Child.all.size).to eq(2)
      expect(Incident.all.size).to eq(1)
      expect(RecordHistory.where(record_id: incident2.id)).to be_empty
      expect(TracingRequest.all.size).to eq(1)
      expect(Flag.all.size).to eq(1)
      expect(Alert.all).to be_empty
      expect(Transition.all).to be_empty
      expect(Attachment.all.size).to eq(1)
    end
  end

  describe 'remove_config' do
    let(:field) do
      Field.create!(display_name: 'ABC 123', name: 'abc_123')
    end

    let(:form_section) do
      FormSection.create!(
        unique_id: 'form-1', name: 'Form 1', parent_form: 'case', form_group_id: 'Group-1',
        fields: [field]
      )
    end

    let(:agency) do
      agency = Agency.create!(name: 'blah', agency_code: 'blah')
      agency.attach_files(logo_full_file_name: 'sample.png', logo_full_base64: attachment_base64('sample.png'))
      agency
    end

    let(:primero_program) do
      PrimeroProgram.create!(unique_id: 'program-1', name: 'Program 1')
    end

    let(:role) do
      Role.create!(
        name: 'role-1',
        permissions: [
          Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])
        ]
      )
    end

    let(:primero_module) do
      PrimeroModule.create!(
        name: 'Primero Module', primero_program:, roles: [role], associated_record_types: ['case']
      )
    end

    before do
      clean_data(Attachment, Field, FormSection, Agency, PrimeroModule, PrimeroProgram, Role)
      ActiveRecord::Base.connection.execute('DELETE FROM active_storage_attachments')
      ActiveRecord::Base.connection.execute('DELETE FROM active_storage_blobs')
      form_section
      agency
      primero_module
    end

    it 'removes configuration data' do
      DataRemovalService.remove_config

      expect(Field.all).to be_empty
      expect(FormSection.all).to be_empty
      expect(Agency.all).to be_empty
      expect(PrimeroModule.all).to be_empty
      expect(PrimeroProgram.all).to be_empty
      expect(Role.all).to be_empty
      expect(Attachment.all).to be_empty
    end

    it 'removes configuration data for the specified model' do
      DataRemovalService.remove_config(metadata: ['Agency'])

      expect(Field.all.size).to eq(1)
      expect(FormSection.all.size).to eq(1)
      expect(Agency.all).to be_empty
      expect(PrimeroModule.all.size).to eq(1)
      expect(PrimeroProgram.all.size).to eq(1)
      expect(Role.all.size).to eq(1)
      expect(Attachment.all).to be_empty
      expect(ActiveRecord::Base.connection.exec_query('SELECT * FROM active_storage_attachments').to_a).to be_empty
      expect(ActiveRecord::Base.connection.exec_query('SELECT * FROM active_storage_blobs').to_a).to be_empty
    end
  end
end
