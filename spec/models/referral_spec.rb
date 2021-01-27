# frozen_string_literal: true

require 'rails_helper'

describe Referral do
  before :each do
    @module_cp = PrimeroModule.new(name: 'CP')
    @module_cp.save(validate: false)
    @module_gbv = PrimeroModule.new(name: 'GBV')
    @module_gbv.save(validate: false)
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::RECEIVE_REFERRAL]
    )
    @role = Role.new(permissions: [permission_case], modules: [@module_cp])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
    @user2.save(validate: false)
    @service1 = { 'unique_id' => 'service_1_123' }
    @service2 = { 'unique_id' => 'service_2_345', 'service_implemented_day_time' => '2021-01-15T16:46:53.701Z' }
    @case = Child.create(data:
      {
        name: 'Test',
        owned_by: 'user1',
        module_id: @module_cp.unique_id,
        consent_for_services: true,
        disclosure_other_orgs: true,
        services_section: [@service1, @service2]
      })
  end

  describe 'consent' do
    it 'denies consent for referring records if consent properties are not set' do
      @case.update_attributes(consent_for_services: nil, disclosure_other_orgs: nil)
      referral = Referral.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(referral.consent_given?).to be_falsey
    end

    it 'consents for referring GBV records if referral_for_other_services is set to true' do
      @case.update_attributes(module_id: @module_gbv.unique_id)
      referral = Referral.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(referral.consent_given?).to be_truthy
    end

    it 'consents for referring CP records if referral_for_other_services and disclosure_other_orgs are set to true' do
      referral = Referral.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(referral.consent_given?).to be_truthy
    end
  end

  describe 'perform' do
    context 'in-system' do
      it 'adds the target user to the assigned users list for this record' do
        referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
        expect(referral.status).to eq(Referral::STATUS_INPROGRESS)
        expect(@case.assigned_user_names).to include(referral.transitioned_to)
      end

      it 'does not perform the referral if the receiving user is not allowed to receive referrals' do
        permission_case = Permission.new(
          resource: Permission::CASE,
          actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
        )
        @role.permissions = [permission_case]
        @role.save(validate: false)
        referral = Referral.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(referral.valid?).to be_falsey
        expect(@case.assigned_user_names.present?).to be_falsey
      end
    end
  end

  describe 'reject' do
    context 'when show_provider_note_field and set_service_implemented_on are set to false' do
      before :each do
        SystemSettings.reset
        SystemSettings.create!(show_provider_note_field: false, set_service_implemented_on: false)
        @case.update_attributes(consent_for_services: true, disclosure_other_orgs: true)
      end

      it 'removes the referred user' do
        referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
        referral.reject!

        expect(referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'does not set the service_implemented_day_time and does not change the service to implemented' do
        referral = Referral.create!(
          transitioned_by: 'user1',
          transitioned_to: 'user2',
          record: @case,
          service_record_id: @service1['unique_id']
        )
        referral.reject!

        service_object = @case.services_section.find { |current| current['unique_id'] == @service1['unique_id'] }

        expect(service_object['service_implemented_day_time']).to be_nil
        expect(service_object['service_implemented']).to be_nil
      end

      after :each do
        SystemSettings.destroy_all
      end
    end

    context 'when set_service_implemented_on and show_provider_note_field are set to true' do
      before :each do
        SystemSettings.reset
        SystemSettings.create!(show_provider_note_field: true, set_service_implemented_on: true)
        @case.update_attributes(consent_for_services: true, disclosure_other_orgs: true)
      end

      it 'mark the service object as implemented' do
        json_date_time = '2021-01-20T16:46:53.701Z'
        date_time = DateTime.parse(json_date_time)
        Time.stub(:now).and_return(date_time)

        referral = Referral.create!(
          transitioned_by: 'user1',
          transitioned_to: 'user2',
          record: @case,
          service_record_id: @service1['unique_id']
        )
        referral.reject!

        service_object = @case.services_section.find { |current| current['unique_id'] == @service1['unique_id'] }

        expect(service_object['service_implemented_day_time']).to eq(json_date_time)
        expect(service_object['service_implemented']).to eq(Serviceable::SERVICE_IMPLEMENTED)
      end

      it 'does not set the implemented_day_time if already set' do
        referral = Referral.create!(
          transitioned_by: 'user1',
          transitioned_to: 'user2',
          record: @case,
          service_record_id: @service2['unique_id']
        )
        referral.reject!

        service_object = @case.services_section.find { |current| current['unique_id'] == @service2['unique_id'] }

        expect(service_object['service_implemented_day_time']).to eq(@service2['service_implemented_day_time'])
        expect(service_object['service_implemented']).to eq(Serviceable::SERVICE_IMPLEMENTED)
      end

      it 'sets the notes from provider in the referral and the service object if specified' do
        referral = Referral.create!(
          transitioned_by: 'user1',
          transitioned_to: 'user2',
          record: @case,
          service_record_id: @service1['unique_id']
        )
        notes_from_provider = 'This is a test'
        referral.reject!(notes_from_provider)

        service_object = @case.services_section.find { |current| current['unique_id'] == @service1['unique_id'] }

        expect(service_object['note_on_referral_from_provider']).to eq(notes_from_provider)
        expect(referral.note_on_referral_from_provider).to eq(notes_from_provider)
      end

      after :each do
        SystemSettings.destroy_all
      end
    end
  end

  after :each do
    PrimeroModule.destroy_all
    UserGroup.destroy_all
    Role.destroy_all
    User.destroy_all
    Child.destroy_all
    Transition.destroy_all
  end
end
